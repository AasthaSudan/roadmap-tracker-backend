require("dotenv").config();

console.log(process.env.REDIS_PORT);

module.exports = {

    port: Number(process.env.PORT) || 3000,

    jwtSecret: process.env.JWT_SECRET,

    databaseUrl: process.env.DATABASE_URL,

    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },

    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },

    smtp: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },

};
