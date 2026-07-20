const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { users } = require('../data/store');
const emailQueue = require("../queues/emailQueue");
const logger = require("../utils/logger");

const config = require("../config/env");

const GITHUB_CLIENT_ID = config.github.clientId;
const GITHUB_CLIENT_SECRET = config.github.clientSecret;
const JWT_SECRET = config.jwtSecret;

// Signup controller 
async function signup(req, res) {
    try {
        const { name, email, password } = req.body;

        // validate name
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

        // validate email
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

        // basic email format check
        if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
            return res.status(400).json({
                message: 'Please enter a valid email address',
            });
        }

        // validate password
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

        // check if email already exists
        const existingUser = users.find((user) => user.email === cleanEmail);

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists',
            });
        }

        // hash password before storing it in our users array
        const hashedPassword = await bcrypt.hash(password, 10);

        // create local user
        const newUser = {
            id: users.length + 1,
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            provider: 'local',
        };

        users.push(newUser);

        // Send welcome email
        try {
            await emailQueue.add(
                "welcome-email", //job name
                //payload(data)
                {
                    email: newUser.email,
                    name: newUser.name,
                },
                //options
                {
                    attempts: 3, //job will be retried 3 times if it fails

                    // exponential backoff with initial delay of 2 seconds
                    backoff: {
                        type: "exponential",
                        delay: 2000,
                    },

                    delay: 10000, // 10 seconds

                    removeOnComplete: true, //job will be removed from queue once completed
                    removeOnFail: false, //job will not be removed from queue if it fails
                }
            );

            logger.info("Welcome email job added to queue");

        } catch (error) {
            logger.error(error);
            throw error;
        }

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
}

// ===== Login controller =====
async function login(req, res) {
    try {
        const { email, password } = req.body;

        // validate presence
        if (email === undefined || password === undefined) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        // validate types
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                message: 'Email and password must be strings',
            });
        }

        // normalize email so login matches how signup stored it
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail) {
            return res.status(400).json({
                message: 'Email cannot be empty',
            });
        }

        if (!password) {
            return res.status(400).json({
                message: 'Password cannot be empty',
            });
        }

        // check if user exists
        const user = users.find((user) => user.email === cleanEmail);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // compare plain password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // create JWT token for our app
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

        logger.info(jwt.decode(token));

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
}

// ===== GitHub OAuth: redirect user to GitHub login page =====
function githubAuthRedirect(req, res) {
    const githubAuthUrl =
        `https://github.com/login/oauth/authorize` +
        `?client_id=${GITHUB_CLIENT_ID}` +
        `&scope=read:user user:email`; // read:user -> profile info, user:email -> email access

    res.redirect(githubAuthUrl);
}

// ===== GitHub OAuth callback =====
async function githubCallback(req, res) {
    const code = req.query.code; // temporary authorization code from GitHub

    if (!code) {
        return res.status(400).json({
            message: 'GitHub code is missing from callback.',
        });
    }

    try {
        // Exchange authorization code for GitHub access token
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

        // Fetch GitHub user profile using GitHub access token
        const githubUserResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
            },
        });

        const githubUser = githubUserResponse.data;

        /*
         githubUser example fields:
         githubUser.id
         githubUser.login
         githubUser.name
         githubUser.html_url
         githubUser.avatar_url
        */

        // Check if this GitHub user already exists in our app users array
        let existingUser = users.find(
            (user) =>
                user.provider === 'github' && user.githubId === githubUser.id
        );

        if (!existingUser) {
            // Create a new GitHub-based user in our local app
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
            // If user already exists, update stored GitHub access token
            existingUser.githubAccessToken = githubAccessToken;
        }

        // Generate our own app JWT after GitHub login succeeds
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
}

// ===== Protected profile controller =====
function getProfile(req, res) {
    res.json({
        message: 'Protected profile fetched successfully',
        user: req.user,
    });
}

module.exports = {
    signup,
    login,
    githubAuthRedirect,
    githubCallback,
    getProfile,
};