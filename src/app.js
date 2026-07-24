const compression = require("compression");
const routes = require("./routes");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require('dotenv').config();

const morgan = require("morgan");
const logger = require("./utils/logger");

const express = require('express');
const app = express();

const limiter = rateLimit({
    windowMs: (Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000), // 15 minutes
    max: Number(process.env.RATE_LIMIT_MAX || 100), // max requests per IP
    message: {
        error: "Too many requests. Please try again later.",
    },
});

const loggerMiddleware = require('./middleware/loggerMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');



app.use( //morgan combined logs with logger stream
    morgan("combined", { //predefined format, combined = dev + common + referrer + timing (detailed production format)
        stream: logger.stream,
    })
);

app.use(helmet()); //basic security headers

app.use(compression()); //compresses response bodies

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173", //only allow frontend to connect
        credentials: true,
    })
);

app.use(limiter); //rate limiting

// parse incoming JSON request bodies
app.use(express.json());

const path = require("path"); //used to resolve file paths

//serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// log every incoming request
app.use(loggerMiddleware);

// route groups
app.use(routes);

// swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler -> runs only if no route matched above
app.use(notFoundMiddleware);

// global error handler -> runs when next(error) is called
app.use(errorMiddleware);

module.exports = app;