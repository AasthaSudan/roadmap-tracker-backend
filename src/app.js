console.log("APP.JS LOADED");

require('dotenv').config();

const express = require('express');
const app = express();

const loggerMiddleware = require('./middleware/loggerMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

const healthRoutes = require('./routes/healthRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const topicRoutes = require('./routes/topicRoutes');

console.log("notFoundMiddleware:", notFoundMiddleware);
console.log("errorMiddleware:", errorMiddleware);

console.log({
    healthRoutes: typeof healthRoutes,
    roadmapRoutes: typeof roadmapRoutes,
    authRoutes: typeof authRoutes,
    githubRoutes: typeof githubRoutes,
    topicRoutes: typeof topicRoutes
});

// parse incoming JSON request bodies
app.use(express.json());

// log every incoming request
app.use(loggerMiddleware);

// route groups
app.use('/', healthRoutes);
app.use('/', roadmapRoutes);
app.use('/', authRoutes);
app.use('/', githubRoutes);
app.use('/', topicRoutes);

// 404 handler -> runs only if no route matched above
app.use(notFoundMiddleware);

// global error handler -> runs when next(error) is called
app.use(errorMiddleware);

module.exports = app;