const { Server } = require("socket.io");
const uuid = require("uuid");
const { sendMessage, loadMessagesHistory, deleteMessageById, revokeMessageById } = require("./chat.service");
const MessageModel = require("../models/message.model");
const { message } = require("../controllers/socket.controller");
const { findProfileById } = require("./profile.service");
require("dotenv").config();

const { URL_CLIENT_WEB } = process.env;

let io = new Server({
    cors: {
        origin: URL_CLIENT_WEB,
        allowedHeaders: ["x-client-id"],
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


    //Xu li tin nhan


    //THEM USER VAO MAP CLIENT HIEN CO TREN SERVER DE QUAN LI
    socket.on("addUser", async (data) => {
        try {
            await addUserSocket(data, socket);
        } catch (error) {
            console.error("Error adding user:::", error);
        }
    });


    //CHUA DUNG DEN
    socket.on("loadChannels", async (userId) => {
        try {
            socket.emit("loadChannels");
            const channelId = _userOnlines.get(userId);
            if (channelId) {
                socket.to(channelId).emit("loadChannels");
            }
        } catch (error) {
            console.error("Error loading chat:", error);
        }
    });


    //TAI TIN NHAN TU DATABASE KHI CLIENT KET NOI DEN
    socket.on("loadMessages", async (data) => {
        //sender id = id nguoi dang nhap => cu the o day la profileId 
        //messages = array 50 tin nhan moi nhat tu database
        // receiver id = danh sach id cua channel
        const { senderId } = data;
        try {
            const senderChannelsId = _userOnlines.get(senderId); // Lay duoc danh sach cac kenh hien co cua user nay
            if (senderChannelsId) {
                senderChannelsId.map(async (channel) => {

                    const messages = await MessageModel.find({
                        receiverId: channel
                    })
                        .sort({ createdAt: -1 }) //sap xep thu tu tin moi nhat xep truoc 
                        .limit(50)
                        .populate({
                            path: 'senderId', // ten field join
                            select: 'avatar fullName' //cac truong duoc chon de lay ra 
                        })
                        .lean()
                    socket.emit('getMessages', {
                        _id: channel,
                        messages: [...messages.reverse()] //dao nguoc thu tu tin cu nhat xep dau tien
                    })
                })

            }
        } catch (error) {
            console.error("Error loading message:", error);
        }
    });


    //GUI 1 TIN NHAN
    socket.on("sendMessage", async (data) => {
        const { senderId, receiverId, typeContent, messageContent } = data;
        try {
            //Lay ra channel cua user dang online
            const listChannel = _userOnlines.get(senderId);

            //Kiem tra channel co hop le hay khong
            const check = listChannel.find(channel => channel == receiverId)
            if (check !== undefined) {
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

                    await io.to(receiverId).emit("getMessage", newMessage);

                    // await socket.to(receiverId).emit("getMessage", newMessage);
                    // await socket.emit("getMessage", newMessage);

                } catch (error) {
                    //Tra ra thong bao neu tin nhan khong thanh cong
                    socket.emit("errorSendMessage")
                }

            } else {
                socket.emit("errorSendMessage")
            }
        } catch (error) {
            socket.emit("errorSendMessage")
        }
    });


    //TAI LICH SU TIN NHAN
    socket.on("loadMessagesHistory", async (data) => {
        //sender id = id nguoi dang nhap => cu the o day la profileId 
        //oldMessageId = id tin nhan cu nhat o client hien co
        // receiver id = danh sach id cua channel
        const { senderId, oldMessageId, receiverId } = data;
        try {
            const senderChannelsId = _userOnlines.get(senderId); // Lay duoc danh sach cac kenh hien co cua user nay
            if (senderChannelsId) {
                const listMessages = await loadMessagesHistory(data)
                // await socket.to(receiverId).emit('getMessagesHistory', listMessages[0].messages)

                if (listMessages[0].messages.length == 0) {
                    socket.emit('lastMessage', { info: 'No more older messages' })
                } else {

                    socket.emit('getMessagesHistory', listMessages[0])
                }

            }
        } catch (error) {
            console.error("Error loading message:", error);
        }

    });

    //XOA TIN NHAN 
    socket.on("deleteMessage", async (data) => {
        try {
            const deleteMessage = await deleteMessageById(data.messageId);

            if (deleteMessage) {
                console.log("delete mess id:", deleteMessage, "\n receiver: ", deleteMessage.receiverId);
                io.to(String(deleteMessage.receiverId)).emit("messageDeleted", { ...deleteMessage, status: true });
            } else {
                console.log("error: delete message is not exist");
                socket.emit("errorDeleteMessage")
            }


        } catch (error) {
            console.error("Error loading message:", error);
        }

    })

    //THU HOI TIN NHAN
    socket.on("revokeMessage", async (data) => {
        try {
            const revokeMessage = await revokeMessageById(data.messageId);

            if (revokeMessage) {
                console.log("revoke mess id", revokeMessage, "\n receiver: ", revokeMessage.receiverId);
                io.to(String(revokeMessage.receiverId)).emit("messageRevoked", { ...revokeMessage, status: true });
            } else {
                console.log("error: revoke message is not exist");
                socket.emit("errorRevokeMessage")
            }


        } catch (error) {
            console.error("Error loading message:", error);
        }

    })


    //NGAT KET NOI 
    socket.on("disconnect", () => {
        console.log("A user " + socket.id + " disconnected!");
        socket.emit("getUsers", _userOnlines);
    });
});

module.exports = socketService;