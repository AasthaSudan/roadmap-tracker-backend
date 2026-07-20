const client = require("./config/elasticsearch");
const logger = require("../utils/logger");

async function testConnection() {
    try {
        const response = await client.info();

        logger.info("Connected Successfully!");
        logger.info(response);
    } catch (error) {
        logger.error("Connection Failed");
        logger.error(error);
    }
}

testConnection();