require('dotenv').config();

const express = require('express'); //imports the Express library into file
const jwt = require('jsonwebtoken'); //to create & verify JWTs
const bcrypt = require('bcryptjs'); //to hash & verify passwords
const axios = require('axios'); //used to make HTTP requests to external APIs, like GitHub.

const app = express(); //creates an Express application object (app: ur backend app instance)
const PORT = process.env.PORT || 3000; //sets the port number ur backend/server will run on(thru which requests reach ur app)

// For GitHub OAuth
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;


app.use(express.json()); // Middleware to parse JSON request bodies
app.use(loggerMiddleware); //apply logger to all incoming requests

// In-memory data
let roadmaps = [
    {
        id: 1,
        title: 'Backend Fundamentals',
        description: '31-day backend learning roadmap',
    },
    {
        id: 2,
        title: 'Flutter Revision',
        description: 'Brush up Flutter before interviews',
    },
];

//In-memory user database
let users = [];

/*
User shape examples:

1) Normal email/password user
{
  id: 1,
  name: 'Aastha',
  email: 'aastha@example.com',
  password: 'hashed-password',
  provider: 'local'
}

2) GitHub user
{
  id: 2,
  name: 'Aastha Sudan',
  email: null,
  password: null,
  provider: 'github',
  githubId: 123456,
  githubUsername: 'aasthaSudan',
  githubAccessToken: 'gho_xxx'
}
*/

function loggerMiddleware(req, res, next) {
    const currentTime = new Date().toISOString(); //gives current time in a standard readable format
    console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);

    next(); //IMPORTANT:- “Logger has finished its job. Continue to the next middleware / route handler.”
}

app.get('/', (req, res) => { //req-request, res-response
    res.send('Roadmap Tracker backend is running...')
});

app.get('/health', (req, res) => {
    res.json({ //sends a JSON response
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});

app.get('/inspect', (req, res) => { //inspect->lets ur server show u wht req it received( http method, url, headers)
    res.json({
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
    });
});

//Inspect request body- let you see what Express received in req.body.
app.post('/inspect-body', (req, res) => {
    res.json({
        message: 'Request body received successfully',
        body: req.body,
    });
});

//GET all roadmaps
app.get('/roadmaps', (req, res) => {
    res.json({
        message: 'All roadmaps fetched successfully',
        total: roadmaps.length, //no. of items
        data: roadmaps, //actual roadmaps
    });
});

//upgraded route: POST roadmap using real JSON body
app.post('/roadmaps', authMiddleware, (req, res) => {
    const { title, description, difficulty } = req.body; //read data from request body

    //validate title
    if (title === undefined) {
        return res.status(400).json({
            message: 'Title is required',
        });
    }

    if (typeof title !== 'string') {
        return res.status(400).json({
            message: 'Title must be a string',
        });
    }

    const cleanTitle = title.trim();

    if (!cleanTitle) {
        return res.status(400).json({
            message: 'Title cannot be empty',
        });
    }

    //validate description
    let cleanDescription = '';

    if (description !== undefined) {
        if (typeof description !== 'string') {
            return res.status(400).json({
                message: 'Description must be a string',
            });
        }

        cleanDescription = description.trim();
    }

    //validate difficulty
    let cleanDifficulty = null;

    if (difficulty !== undefined) {
        if (typeof difficulty !== 'number' || !Number.isInteger(difficulty)) {
            return res.status(400).json({
                message: 'Difficulty must be an integer between 1 and 5',
            });
        }

        if (difficulty < 1 || difficulty > 5) {
            return res.status(400).json({
                message: 'Difficulty must be an integer between 1 and 5',
            });
        }

        cleanDifficulty = difficulty;
    }

    const newRoadmap = { //So now the roadmap is client-driven, not hardcoded by the server
        id: roadmaps.length + 1,
        title: cleanTitle,
        description: cleanDescription,
        difficulty: cleanDifficulty,
    }

    roadmaps.push(newRoadmap);

    res.status(201).json({ //"request succeeded and new resource created"
        message: 'Roadmap created successfully',
        data: newRoadmap,
    });
});

//dynamic routing + route params + delete flow
//DELETE roadmap by id
app.delete('/roadmaps/:id', authMiddleware, (req, res) => {
    const roadmapId = Number(req.params.id); //e.g. req.params.id might be "1", it comes as a string, so convert to number

    const roadmapIndex = roadmaps.findIndex((roadmap) => roadmap.id === roadmapId); //searches the array and returns the position of the matching roadmap, otherwise -1

    if (roadmapIndex === -1) { //if -1, means not found
        return res.status(404).json({ //404: not found, return is important because it prevents the rest of the delete logic from running
            message: `Roadmap with id ${roadmapId} not found`,
        });
    }

    const deletedRoadmap = roadmaps[roadmapIndex]; //first store the roadmap you’re about to remove
    roadmaps.splice(roadmapIndex, 1); //then remove it from the array using splice

    res.json({
        message: 'Roadmap deleted successfully', //success response
        data: deletedRoadmap, //sees which roadmap was deleted
    });
});

//middleware to authenticate token
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization; //Bearer <token>

    if (!authHeader) {
        return res.status(401).json({
            message: 'Access denied. No token provided.',
        });
    }

    const token = authHeader.split(' ')[1]; //Bearer <token>, So we split it and take the second part.

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. Invalid token format.',
        });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        //Attach decoded user info to request
        req.user = decodedToken; //<-- This attaches the user data to the request object itself so that your route handlers can access it using req.user.

        next(); //“Auth check passed. Continue to the actual route handler.” 
        // Without next(), request would get stuck in middleware.
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token.',
        });
    }
}

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validate name
        if (name === undefined) {
            return res.status(400).json({
                message: 'Name is required',
            });
        }

        if (typeof name !== 'string') {
            return res.status(400).json({
                message: 'Name must be a string',
            });
        }

        const cleanName = name.trim();

        if (!cleanName) {
            return res.status(400).json({
                message: 'Name cannot be empty',
            });
        }

        //validate email
        if (email === undefined) {
            return res.status(400).json({
                message: 'Email is required',
            });
        }

        if (typeof email !== 'string') {
            return res.status(400).json({
                message: 'Email must be a string',
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            return res.status(400).json({
                message: 'Email cannot be empty',
            });
        }

        // Basic email format check
        if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
            return res.status(400).json({
                message: 'Please enter a valid email address',
            });
        }

        //validate password
        if (password === undefined) {
            return res.status(400).json({
                message: 'Password is required',
            });
        }

        if (typeof password !== 'string') {
            return res.status(400).json({
                message: 'Password must be a string',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long',
            });
        }

        //Check if email already exists
        const existingUser = users.find((user) => user.email === cleanEmail);

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists',
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const newUser = {
            id: users.length + 1,
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            provider: 'local',
        };

        users.push(newUser);

        res.status(201).json({
            message: 'User signed up successfully',
            data: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                provider: newUser.provider,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong during signup.',
            error: error.message,
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        //check if user exists
        const user = users.find((user) => user.email === email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        //verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                name: user.name,
                provider: user.provider,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong during login.',
            error: error.message,
        });
    }
});

app.get('/auth/github', (req, res) => {
    const githubAuthUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${GITHUB_CLIENT_ID}` +
        `&scope=read:user user:email`; //This tells GitHub what permissions your app wants. read:user -> profile information. user:email -> email address

    res.redirect(githubAuthUrl);
});

app.get('/auth/github/callback', async (req, res) => {
    const code = req.query.code; //req.query.code is that temporary authorization code.

    if (!code) {
        return res.status(400).json({
            message: 'GitHub code is missing from callback.',
        });
    }

    try {
        //Token exchange (POST request to GitHub to exchange code for access token)
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        const githubAccessToken = tokenResponse.data.access_token;
        if (!githubAccessToken) {
            return res.status(400).json({
                message: 'Failed to get GitHub access token.',
                githubResponse: tokenResponse.data,
            });
        }

        //Fetch GitHub user data
        const githubuserResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
            },
        });

        const githubUser = githubuserResponse.data;

        /*
         githubUser example fields:
         githubUser.id
         githubUser.login
         githubUser.name
         githubUser.html_url
         githubUser.avatar_url
       */

        // Check if user already exists
        //create find local user
        let existingUser = users.find(
            (user) =>
                user.provider === 'github' && user.githubId === githubUser.id
        )

        if (!existingUser) {
            // Create new user
            existingUser = {
                id: users.length + 1,
                name: githubUser.name || githubUser.login,
                email: null,
                password: null,
                provider: 'github',
                githubId: githubUser.id,
                githubUsername: githubUser.login,
                githubProfileUrl: githubUser.html_url,
                githubAvatarUrl: githubUser.avatar_url,
                githubAccessToken,
            };

            users.push(existingUser);
        } else {
            existingUser.githubAccessToken = githubAccessToken;
        }

        // Generate JWT token, issue your app JWT
        const appToken = jwt.sign(
            {
                userId: existingUser.id,
                name: existingUser.name,
                provider: existingUser.provider,
                githubId: existingUser.githubId,
                githubUsername: existingUser.githubUsername,
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Github login successful',
            appToken,
            githubUser: {
                githubId: existingUser.githubId,
                githubUsername: existingUser.githubUsername,
                name: existingUser.name,
                githubProfileUrl: existingUser.githubProfileUrl,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Github OAuth failed',
            error: error.response?.data || error.message,
        });
    }
});

//Protected route
app.get('/profile', authMiddleware, (req, res) => {
    res.json({
        message: 'Protected profile fetched successfully',
        user: req.user,
    });
});

app.listen(PORT, () => { //starts the server & tells it to listen for incoming req on that port
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});