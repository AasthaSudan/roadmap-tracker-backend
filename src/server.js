const express = require('express'); //imports the Express library into file

const app = express(); //creates an Express application object (app: ur backend app instance)
const PORT = 3000; //sets the port number ur backend/server will run on(thru which requests reach ur app)

// In-memory dummy data
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

//GET all roadmaps
app.get('/roadmaps', (req, res) => {
    res.json({
        message: 'All roadmaps fetched successfully',
        total: roadmaps.length, //no. of items
        data: roadmaps, //actual roadmaps
    });
});

//POST a new roadmap (dummy hardcoded for routing practice)
app.post('/roadmaps', (req, res) => {
    const newRoadmap = {
        id: roadmaps.length + 1,
        title: `New Roadmap ${roadmaps.length + 1}`,
        description: `Dummy roadmap created for Day 3 routing practice`,
    };

    roadmaps.push(newRoadmap);

    res.status(201).json({ //"request succeeded and new resource created"
        message: 'Roadmap created successfully',
        data: newRoadmap,
    });
});

//dynamic routing + route params + delete flow
//DELETE roadmap by id
app.delete('/roadmaps/:id', (req, res) => {
    const roadmapId = Number(req.params.id); //e.g. req.params.id might be "1", it comes as a string, so convert to number

    const roadmapIndex = roadmaps.findIndex((roadmap) => roadmap.id == roadmapId); //searches the array and returns the position of the matching roadmap, otherwise -1

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

app.listen(PORT, () => { //starts the server & tells it to listen for incoming req on that port
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});