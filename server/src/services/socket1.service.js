const { findChannelByUserId } = require("./channel.service");
const ProfileModel = require("../models/profile.model");
const { addUserSocket } = require("./user.service");


global._userOnlines = new Map();

class SocketService {

    async connection(socket) {
        console.log("user connected", socket.id);

        socket.on('addUser', (data) => {
            const { userId } = data;
            addUserSocket(userId, socket);
            console.log(_userOnlines);
        });

        socket.on("addChannel", (data) => {
            console.log(data);
            const { userId, channels } = data;
            channels.map((channel, index) => {
                console.log("member ", channel.members);
                channel.members.map((member, index) => {
                    addUserSocket(member, socket);
                    console.log("member add channel:", member, " by userId: ", userId);
                })
            });
        });


        socket.on('chat message', (data) => {
            const { text, channel } = data;
            console.log("chat la ", text, "\n o channel", channel);
            _io.to(channel).emit('chat message', text);
        })

        socket.on("disconnect", () => {
            console.log("a user " + socket.id + " disconnected!");
            _io.emit("getUsers", _userOnlines);
        });

    }


    /* //connectino
    connection(socket) {
        console.log(`User connect id is ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`User disconnect id is ${socket.id}`);
        })

     
        socket.on('chat message', (msg, roomId) => {
            console.log(`Received message from user ${socket.id} in room ${roomId}: ${msg}`);

     
            socket.to(roomId).emit('chat message', msg);
        });

    
        socket.on('join room', (roomId) => {
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.join(roomId);
        });

    
        socket.on('disconnect', () => {
            console.log(`User disconnected with id: ${socket.id}`);
        });
    } */

    /* async connection(socket) {
        var activeUsers = {};
      
        console.log(`User connected with id: ${socket.id}`);
        const userId = socket.handshake.query.userId;
        console.log(`User connected with userid: ${userId}`);

        socket.on('join room', (room) => {
            socket.join(room); //Them nguoi dung vao phong o server side
            console.log(`User ${socket.id} joined room ${room}`);
        });

   
        socket.on('chat message', (data) => {
            const { text, room } = data;
            _io.to(room).emit('chat message', text); //Gui tin nhan den tat ca moi nguoi trong phong
        });

         socket.on('disconnect', () => {
             console.log(`User disconnected with id: ${socket.id}`);
         });


      
        socket.emit('initialActiveStatus', activeUsers);

   
        socket.on('setActive', () => {
            activeUsers[socket.id] = true; 
            _io.emit('activeStatus', socket.id, true); 
        });

  
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
            delete activeUsers[socket.id]; 
            _io.emit('activeStatus', socket.id, false); 
        });

    } */

    /* connection(socket) {
        var activeUsers = {};

        console.log(`User connected with id: ${socket.id}`);
        const clientId = socket.handshake.query.clientId;
        const userId = socket.handshake.query.userId;
        console.log(`User connected with clientId: ${clientId}, userId: ${userId}`);

        socket.on('join room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room ${room}`);
        });


        socket.on('chat message', (data) => {
            const { text, room } = data;
            _io.to(room).emit('chat message', text);
        })

        socket.emit('initialActiveStatus', activeUsers);


        socket.on('setActive', () => {
            activeUsers[socket.id] = { clientId, userId };
            _io.emit('activeStatus', socket.id, true);
        });


        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
            delete activeUsers[socket.id];
            _io.emit('activeStatus', socket.id, false);
        });
    } */









}

module.exports = new SocketService();