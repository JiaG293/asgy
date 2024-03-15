const { Server } = require("socket.io");
const uuid = require("uuid");
require("dotenv").config();

const { URL_CLIENT_WEB } = process.env

let io = new Server(
    {
        cors: {
            origin: URL_CLIENT_WEB,
            credentials: true,
        },
    }
);



const socketService = {
    io: io,
};

global._userOnlines = new Map();
global._userCall = new Map();

const addUserSocket = async (userId, socket) => {
    let tmp = _userOnlines.get(userId);
    if (tmp) {
        console.log("user exist, join channelId: ", tmp);
        socket.join(tmp);
    } else {
        const channelId = uuid.v4(); // tao channelId tam thoi de cho user tham gia phong
        socket.join(channelId);
        _userOnlines.set(userId, channelId);
    }

}

io.on("connection", (socket) => {
    global._io = socket;


    socket.on('addUser', (data) => {
        const { userId } = data;
        addUserSocket(userId, socket);
        console.log("add user: online ", _userOnlines);
    });


    //Lay tat cac cac channelId cua user co de them vao userid vao channel
    socket.on("addChannel", (data) => {
        const { senderId, channels } = data;
        channels.members.map((member, index) => {
            addUserSocket(member.profileId, socket);
            console.log("add channel: add userId all channel have", member.profileId, " by userId: ", senderId);
        });
    });

    socket.on("loadChat", (sender_id) => {
        socket.emit("loadChat");
        socket.to(_userOnlines.get(sender_id)).emit("loadChat");
    });

    socket.on("loadMessage", (data) => {
        const { sender_id, messages, receiverId } = data;
        socket.emit("loadChat");
        socket.to(_userOnlines.get(sender_id)).emit("loadChat");
        socket.emit("loadMessage", { messages });
        socket
            .to(_userOnlines.get(sender_id))
            .emit("loadMessage", { messages });

        socket.to(_userOnlines.get(receiverId)).emit("loadChat");
        socket
            .to(_userOnlines.get(receiverId))
            .emit("loadMessageReceiver", { messages });
    });


    socket.on("sendMessage", (data) => {
        const { senderId, receiverId, typeContent, messageContent, _id } = data;
        console.log("user online ", _userOnlines);
        const socketId = _userOnlines.get(receiverId);
        socket.emit("loadMessage");
        socket.to(_userOnlines.get(senderId)).emit("loadMessage");
        if (socketId) {
            socket.to(socketId).emit("getMessage", {
                senderId,
                messageContent,
                receiverId,
                typeContent,
                _id,
            });
            socket.to(_userOnlines.get(senderId)).emit("getMessage", {
                senderId,
                messageContent,
                receiverId,
                typeContent,
                _id,
            });
        }

    });

    socket.on("disconnect", () => {
        console.log("a user " + socket.id + " disconnected!");
        socket.emit("getUsers", _userOnlines);
    });


    /* socket.on("loadChannel", (sender_id) => {
        socket.emit("loadChannel");
        socket.to(_userOnlines.get(sender_id)).emit("loadChannel");
    });

    socket.on("loadMessages", (data) => {
        const { senderId, messages, receiverId } = data;
        socket.emit("loadChannel");
        socket.to(_userOnlines.get(sender_id)).emit("loadChannel");
        socket.emit("loadMessages", { messages });
        socket
            .to(_userOnlines.get(sender_id))
            .emit("loadMessages", { messages });

        socket.to(_userOnlines.get(receiverId)).emit("loadChannel");
        socket
            .to(_userOnlines.get(receiverId))
            .emit("loadMessageReceiver", { messages });
    }); */

})



module.exports = socketService;
