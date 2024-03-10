const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-streams-adapter');
require('dotenv').config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redisClient = createClient({
    host: REDIS_HOST, //<hostname>'
    port: REDIS_PORT,//<port> 
    password: REDIS_PASSWORD,//'<password>'
});

redisClient.ping(function (err, result) {
    console.log(result);
})

redisClient.on('connect', () => {
    console.log('Redis client connected');
});

redisClient.on("error", (error) => {
    console.error(error);
});

module.exports = redisClient