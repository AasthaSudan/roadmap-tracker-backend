const client = require("./config/elasticsearch");

async function testConnection() {
    try {
        const response = await client.info();

        console.log("Connected Successfully!");
        console.log(response);
    } catch (error) {
        console.error("Connection Failed");
        console.error(error);
    }
}

testConnection();