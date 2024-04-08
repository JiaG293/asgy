const { Server } = require("socket.io");
const { sendMessage, loadMessagesHistory, deleteMessageById, revokeMessageById } = require("./chat.service");
const MessageModel = require("../models/message.model");
const ProfileModel = require("../models/profile.model");

const { findTokenById } = require("./keyToken.service");
const { verifyJWT } = require("../auth/authUtils");
const mongoose = require("mongoose");
require("dotenv").config();

const { URL_CLIENT_WEB } = process.env;

let io = new Server({
    cors: {
        origin: URL_CLIENT_WEB,
        allowedHeaders: ["x-client-id", "authorization"],

        credentials: true,
    }, transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e8, // 100 MB we can upload to server (By Default = 1MB)
    pingTimeout: 60000, // increate the ping timeout
});

const socketService = {
    io: io,
};

global._userOnlines = new Map();
global._userCall = new Map();

//them user va danh sach channel vao map _userOnlines
const addUserSocket = async (data, socket) => {
    const { profileId, channels } = data;
    let tmp = _userOnlines.get(profileId);
    if (tmp) {
        tmp.map((channel) => {
            socket.join(channel);
        })
    } else {
        _userOnlines.set(profileId, channels);
        _userOnlines.get(profileId).map((channel) => {
            socket.join(channel);
        })
    }
};

// check thong tin token truoc khi connect
io.use(async (socket, next) => {
    try {

        //Lay headers tu client
        const clientId = socket.handshake.headers['x-client-id'];
        const authorization = socket.handshake.headers['authorization'];
        if (clientId == 'undefined' || authorization == 'undefined') {
            throw new Error('x-client-id and authorization provided')
        }
        const keyStore = await findTokenById(clientId);
        if (!keyStore) {
            throw new Error('Not found key store')
        }

        const decodeUser = await verifyJWT(authorization, keyStore.privateKey);
        if (clientId !== decodeUser.clientId) {
            throw new Error('Invalid UserId')
        }

        //gan thong tin da xac thuc cho auth
        socket.auth = decodeUser;
        return next()
    } catch (error) {
        //that bai tra loi ra day
        //Tra 
        socket.emit('errorAuthentication', { message: error.message, status: 401 });
        return next()
    }
});

io.on("connection", (socket) => {
    //xem thong tin headers

    global._io = socket;
    console.log(" Header xac thuc thong tin", socket.handshake.headers)
    console.log("\n### Socket id connected:::", socket.id)

    //lay thong tin middleware da xac thuc
    console.log("socket user sau khi da xac thuc: ", socket.auth);
    if (socket.auth === undefined) {
        socket.disconnect(socket.id)
    }

    socket.on("test", () => {
        console.log("\n1. Socket id connected:::", socket.id)
        console.log("\n2. List Online:::", _userOnlines)
        // console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms);
        console.log("\n3. UserId Map<SocketId, Set<Room>>:::", socket.adapter.sids)
    })

    socket.on("userActiveRoom", (data) => {
        console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms)
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

    //THEM CHANNEL MOI VAO MOT PROFILEID SOCKET _userOnlines (NEU TAO CHANNEL)
    socket.on("addChannel", async (data) => {
        try {
            const { profileId, channelId } = data
            const listChannels = await _userOnlines.get(profileId)
            if (!listChannels.includes(channelId)) {
                await _userOnlines.get(profileId).push(channelId)
                await socket.join(channelId)
            }
            console.log("List channel new then add channel: ", _userOnlines.get(profileId));
        } catch (error) {
            console.error("Error adding channel:::", error);
        }
    });


    //TAI THONG TIN CHI TIET TAT CA CHANNEL KHI DUA PROFILEID 
    socket.on("loadListDetailsChannels", async (profileId) => {
        try {
            const channelId = _userOnlines.get(profileId);
            const profile = await ProfileModel
                .findOne({ _id: profileId })
                .select('listChannels')
                .populate({
                    path: 'listChannels',
                    populate: {
                        path: 'members.profileId',
                        model: 'Profile',
                        select: '_id fullName avatar '
                    }
                }).lean()
            if (!profile) {
                throw new Error('Profile not existed');
            }

            for (const channel of profile.listChannels) {
                console.log("name channel neu ton tai: ", channel.name);
                // kiem tra xem channel neu la 101 va 102 thi doi ten name Channel && NEU TRONG DAY DA CO TRUONG NAME ROI THI SE KHONG DOI TEN NUA
                let nameChannel = '';
                if ((channel.typeChannel === 101 || channel.typeChannel === 102) && !channel.name) {
                    for (const member of channel.members) {
                        console.log("ten", member);
                        if (member.profileId) {
                            if (member.profileId._id.toString() !== profileId) {
                                nameChannel = member.profileId.fullName;
                                console.log("name channel duoc thay doi la:", nameChannel);
                                break;
                            }
                        }
                    }
                    //Cap nhat lai truong name
                    channel.name = nameChannel;
                }
            }

            await socket.emit('getListDetailsChannels', profile.listChannels)
        } catch (error) {
            socket.emit("error", error);
        }
    });
    /* 
        //CHUA DUNG DEN
        socket.on("loadChannel", async (profileId) => {
            try {
                const channelId = _userOnlines.get(profileId);
                if (channelId) {
                    socket.to(channelId).emit("loadChannel");
                }
            } catch (error) {
                console.error("Error loading chat:", error);
            }
        }); */


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