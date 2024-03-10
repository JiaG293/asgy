class SocketService {


    //connectino
    connection(socket) {
        console.log(`User connect id is ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`User disconnect id is ${socket.id}`);
        })

        //event join room
        socket.on('joinRoom', ({ username, room }) => {
            const user = userJoin(socket.id, username, room);

            socket.join(user.room);

            // Welcome current user
            socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

            // Broadcast when a user connects
            socket.broadcast
                .to(user.room)
                .emit(
                    "message",
                    formatMessage(botName, `${user.username} has joined the chat`)
                );

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });

            //event message
            socket.on('chat message', (msg) => {
                console.log(`msg is ${msg}`);
                _io.emit('chat message', msg)
            })
        })
    }



}

module.exports = new SocketService();