require('dotenv').config();
const { Server } = require('socket.io');
const app = require('./src/app');
const SocketController = require('./src/socket/socket.controller');
const authenticationSocket = require('./src/socket/socket.auth');
const { PORT } = process.env;


//redis adapter stream
/* const { createAdapter } = require('@socket.io/redis-streams-adapter');
const io = new Server({
    adapter: createAdapter(_redisClient)
}); */



/* //C1
const socketService = require('./src/services/socket.service');
const socketController = require('./src/socket/socket.controller');

const server = require('http').createServer(app);
socketService.io.attach(server); */

//C2
const server = require('http').createServer(app);
const io = require('socket.io')(server);
global._io = io;
global._io.use(authenticationSocket)
global._io.on('connection', SocketController.connection)




server.listen(PORT, () => {
    console.log(`server start with  http://locahost:${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log(`exit server express`)
    })
})