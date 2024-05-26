require('dotenv').config();
const app = require('./src/app');
const SocketController = require('./src/socket/socket.controller');
const authenticationSocket = require('./src/socket/socket.auth');
const { instrument } = require('@socket.io/admin-ui');
const { PORT, URL_WEB, URL_MOBILE } = process.env;


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
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: [URL_WEB, URL_MOBILE, "https://admin.socket.io", "http://ec2-18-142-246-203.ap-southeast-1.compute.amazonaws.com", "http://18.142.246.203", "http://localhost:80"],
        allowedHeaders: ["x-client-id", "authorization"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e8, // 100 MB we can upload to server (By Default = 1MB)
    pingTimeout: 60000, // increase the ping timeout
})
global._io = io;
instrument(_io, {
    auth: {
        type: "basic",
        username: "admin",
        password: "$2a$12$emlebPOJC7W5RRfAWfFbKu9t5hG.YV/spyzY8NS0ct6aOyNDFq9e." //hash: 12 | password: admin
    },
    namespaceName: "/admin",
    mode: "development",
    // auth: false,
    // mode: "development",
});
global._io.use(authenticationSocket)
global._io.on('connection', SocketController.connection)


server.listen(PORT, () => {
    console.log(`\nserver start with  http://locahost:${PORT}`);
})

process.on('SIGINT', () => {
    server.close(() => {
        console.log(`exit server express`)
    })
})