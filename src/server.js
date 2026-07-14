console.log("SERVER.JS RUNNING");

const app = require('./app');
const redisClient = require('./config/redis');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        await redisClient.connect();

        console.log("Redis Connected");

        app.listen(3000, () => {
            console.log("Server Running");
        });

    } catch (error) {

        console.log(error);

    }
}

startServer();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check endpoint: http://localhost:${PORT}/health`);
});