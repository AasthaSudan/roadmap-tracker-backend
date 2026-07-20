const winston = require("winston"); //imports Winston for logging

const logger = winston.createLogger({ //creates a new logger instance
    level: "info", //sets minimum level to log

    //priority -> error > warn > info > http > verbose > debug > silly

    format: winston.format.combine(
        winston.format.timestamp({ //sets timestamp format
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }), //captures stack traces for errors
        winston.format.json() //logs in JSON format
    ),

    transports: [ //sends logs to different destinations
        new winston.transports.File({ //logs errors to a file
            filename: "logs/error.log",
            level: "error", //only logs errors
        }),

        new winston.transports.File({ //logs all logs to a file
            filename: "logs/combined.log", //logs all logs
        }),
    ],
});

if (process.env.NODE_ENV !== "production") { //logs to console in development
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), //colors log messages
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                winston.format.printf(
                    ({ timestamp, level, message }) =>
                        `${timestamp} ${level}: ${message}`
                )
            ),
        })
    );
}

logger.stream = { //morgan logs to this stream
    write: (message) => { //takes message as argument
        logger.info(message.trim()); //trims message and logs it as info
    },
};

module.exports = logger;