require('dotenv').config();
const { Server } = require('socket.io');
const app = require('./src/app')
const { PORT } = process.env;


//redis adapter stream
/* const { createAdapter } = require('@socket.io/redis-streams-adapter');
const io = new Server({
    adapter: createAdapter(_redisClient)
}); */

//SOCKET.IO
// const server = require('http').createServer(app)
// const io = new Server(server);
// const SocketService = require('./src/services/socket1.service')
// global._io = io;
const socketService = require('./src/services/socket.service')
const server = require('http').createServer(app);
socketService.io.attach(server);


/* //middlware socket service
global._io.use((socket, next) => {
    const { accessToken } = socket.handshake.headers;

    console.log(`User connect id is ${socket.id}`);
    next()
}) */

// connection socket io
// global._io.on('connection', SocketService.connection)


server.listen(PORT, () => {
    console.log(`server start with  http://locahost:${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log(`exit server express`)
    })
})