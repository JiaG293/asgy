const { Server } = require("socket.io");
const uuid = require("uuid");
const { sendMessage, loadMessagesHistory } = require("./chat.service");
const MessageModel = require("../models/message.model");
const { message } = require("../controllers/socket.controller");
const { findProfileById } = require("./profile.service");
require("dotenv").config();

const { URL_CLIENT_WEB } = process.env;

let io = new Server({
    cors: {
        origin: URL_CLIENT_WEB,
        credentials: true,
    },
});

const socketService = {
    io: io,
};

global._userOnlines = new Map();
global._userCall = new Map();

const addUserSocket = async (data, socket) => {
    const { userId, channels } = data;
    let tmp = _userOnlines.get(userId);
    if (tmp) {
        tmp.map((channel) => {
            socket.join(channel);
        })
    } else {
        _userOnlines.set(userId, channels);
        _userOnlines.get(userId).map((channel) => {
            socket.join(channel);
        })
    }
};


io.on("connection", (socket) => {
    global._io = socket;
    console.log("\n### Socket id connected:::", socket.id);

    socket.on("test", () => {
        console.log("\n1. Socket id connected:::", socket.id);
        console.log("\n2. List Online:::", _userOnlines);
        // console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms);
        console.log("\n3. UserId Map<SocketId, Set<Room>>:::", socket.adapter.sids);
    })

    socket.on("userActiveRoom", (data) => {
        console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms);
    })



    socket.on("addUser", async (data) => {
        try {
            await addUserSocket(data, socket);
        } catch (error) {
            console.error("Error adding user:::", error);
        }
    });

    /* socket.on("addChannel", async (data) => {
        const { senderId, channels } = data;
        try {
            await channels.map((channel) => {
                return addUserSocket(channel, socket);
            })
        } catch (error) {
            console.error("Error adding channel:", error);
        }
    });
 */
    socket.on("loadChat", async (userId) => {
        try {
            socket.emit("loadChat");
            const channelId = _userOnlines.get(userId);
            if (channelId) {
                socket.to(channelId).emit("loadChat");
            }
        } catch (error) {
            console.error("Error loading chat:", error);
        }
    });

    socket.on("loadMessage", async (data) => {
        //sender id = id nguoi dang nhap => cu the o day la profileId 
        //messages = array 50 tin nhan moi nhat tu database
        // receiver id = danh sach id cua channel
        const { senderId } = data;
        try {
            const senderChannelsId = _userOnlines.get(senderId); // danh sach cac kenh cua nguoi dung
            if (senderChannelsId) {
                senderChannelsId.map(async (channel) => {

                    const messages = await MessageModel.find({
                        receiverId: channel
                    })
                        .sort({ createdAt: -1 })
                        .limit(10)
                        .populate({
                            path: 'senderId', // ten field join
                            select: 'avatar fullName' //cac truong duoc chon de lay ra 
                        })
                        .lean()
                    console.log("messages list ", {
                        _id: channel,
                        messages
                    });
                    socket.emit('getListMessages', {
                        _id: channel,
                        messages
                    })
                })

            }
        } catch (error) {
            console.error("Error loading message:", error);
        }
    });

    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, typeContent, messageContent } = data;
        try {
            //Lay ra channel cua user dang online
            const listChannel = _userOnlines.get(senderId);

            //Kiem tra channel co hop le hay khong
            const check = listChannel.find(channel => channel == receiverId)
            if (check != undefined) {
                try {
                    //Luu tin nhan vao database
                    const newMessage = await sendMessage({
                        senderId,
                        messageContent,
                        receiverId,
                        typeContent,
                    })
                    console.log("tin nhan duoc luu vao database", newMessage);
                    // gui tin nhan ve lai cho client de render
                    await socket.to(receiverId).emit("getMessage", newMessage);
                    await socket.emit("getMessage", newMessage);

                } catch (error) {
                    //Tra ra thong bao neu tin nhan khong thanh cong
                    socket.to(receiverId).emit("errorSendMessage")
                }

            } else {
                socket.to(receiverId).emit("errorSendMessage")
            }
        } catch (error) {
            socket.to(receiverId).emit("errorSendMessage")
        }
    });


    socket.on("loadMessagesHistory", async (data) => {
        //sender id = id nguoi dang nhap => cu the o day la profileId 
        //messages = array 50 tin nhan moi nhat tu database
        // receiver id = danh sach id cua channel
        const { senderId, oldMessageId, receiverId } = data;
        try {
            const senderChannelsId = _userOnlines.get(senderId); // danh sach cac kenh cua nguoi dung
            const listMessages = await loadMessagesHistory(data)
            console.log("list tin nhan history", listMessages[0].messages);

            // await socket.to(receiverId).emit('getMessagesHistory', listMessages[0].messages)
            await socket.emit('getMessagesHistory', listMessages[0].messages)

        } catch (error) {
            console.error("Error loading message:", error);
        }
    });


    socket.on("disconnect", () => {
        console.log("A user " + socket.id + " disconnected!");
        socket.emit("getUsers", _userOnlines);
    });
});

module.exports = socketService;