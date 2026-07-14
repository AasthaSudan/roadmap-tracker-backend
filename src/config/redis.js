const { createClient } = require('redis');

// Create one Redis client(communicate with Redis) for the entire application (Singleton)
const client = createClient();

client.on('error', (err) => {
    console.log('Redis Error:', err);
});

module.exports = client;