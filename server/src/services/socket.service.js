const { Server } = require("socket.io");
const { sendMessage, loadMessagesHistory, deleteMessageById, revokeMessageById } = require("./chat.service");
const MessageModel = require("../models/message.model");
const ProfileModel = require("../models/profile.model");
const ChannelModel = require("../models/channel.model");
const { findTokenById } = require("./keyToken.service");
const { verifyJWT } = require("../auth/authUtils");
const mongoose = require("mongoose");
const { checkChannelSingleExists } = require("./channel.service");
require("dotenv").config();

const { URL_CLIENT } = process.env;

const io = new Server({
    cors: {
        origin: URL_CLIENT,
        allowedHeaders: ["x-client-id", "authorization"],

        credentials: true,
    }, transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e8, // 100 MB we can upload to server (By Default = 1MB)
    pingTimeout: 60000, // increate the ping timeout
});

const socketService = {
    io: io,
};

/*  
FORM: 

[ "profileId": 
    [
        { socketId: "socket.id", channels:  ["channelId", "channelId"] },
        { socketId: "socket.id", channels:  ["channelId", "channelId"] },
    ]
] 

*/
global._profileConnected = new Map();
global._io = io
//THEM PROFILEID VAO _PROFILECONNECTED 
const addProfileConnected = async ({ profileId, channels }, socket) => {
    const check = _profileConnected.has(profileId);
    if (check) {
        _profileConnected.get(profileId).push(
            {
                socketId: socket.id,
                channels: channels
            }
        )
        channels.forEach(channelId => socket.join(channelId))
    } else {
        _profileConnected.set(profileId, [
            {
                socketId: socket.id,
                channels: channels
            }
        ]);
        channels.forEach(channelId => socket.join(channelId))
    }

};

//XOA SOCKET.ID KHI CLIENT DISCONNECTED 
const removeProfileConnect = async (profileId, socket) => {
    const check = _profileConnected.has(profileId);
    if (check) {

        //Xoa socket.id neu disconected
        const indexSocket = _profileConnected.get(profileId).findIndex(elem => elem.socketId == socket.id)
        if (indexSocket !== -1) {
            _profileConnected.get(profileId).splice(indexSocket, 1)
        }

        //Neu khoong co socket.id nao ton tai trong do thi se xoa luon profileId 
        if (_profileConnected.get(profileId).length == 0) {
            _profileConnected.delete(profileId)
        }

    } else {
        socket.emit('errorSocket', { message: 'profile id not exist', status: 404 })
    }

};

const emitProfileId = ({ profileId, params, data }, io) => {
    _profileConnected.get(profileId).forEach(socket => io.to(socket.socketId).emit(params, data))
};


const addNewChannel = async (channelId, socket) => {
    const profileId = socket.auth.pro
    if (_profileConnected.has(profileId)) {
        _profileConnected.get(profileId).forEach(elem => {
            if (!elem.channels.includes(channelId)) {
                elem.channels.push(channelId)
                socket.join(channelId)
                socket.to(elem.socketId).emit('createdChannel', channelId) //thong bao da tao channel thanh cong 
            } else {
                socket.emit('errorSocket', { message: 'channel id already exists', status: 409 })
            }
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
    // console.log(" Header xac thuc thong tin", socket.handshake.headers)
    console.log("\n### Socket id connected:::", socket.id)

    //lay thong tin middleware da xac thuc
    console.log("\n### socket user sau khi da xac thuc: \n", socket.auth);
    if (socket.auth === undefined) {
        socket.emit('errorAuthentication', { message: "authorization failed", status: 401 });
        socket.disconnect(socket.id)
    }

    socket.on("test", () => {
        console.log("\n1. Socket id connected:::", socket.id)
        console.log("\n2. List Online:::", _profileConnected)
        // console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms);
        console.log("\n3. UserId Map<SocketId, Set<Room>>:::", socket.adapter.sids)
    })

    socket.on("userActiveRoom", (data) => {
        console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms)
    })


    //Xu li tin nhan

    //CHo SOCKET.ID join vao mot channel
    socket.on("joinChannel", (channelId) => {
        socket.join(channelId)
    })


    //THEM USER VAO MAP CLIENT HIEN CO TREN SERVER DE QUAN LI
    socket.on("addUser", async (data) => {
        const profileId = socket.auth.profileId
        await addProfileConnected({ profileId: profileId, channels: data.channels }, socket);
    });


    //TAI THONG TIN CHI TIET TAT CA CHANNEL KHI DUA PROFILEID 
    socket.on("loadListDetailsChannels", async (profileId) => {
        try {
            const channelId = _profileConnected.get(profileId)
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
            
            const senderChannelsId = _profileConnected.get(senderId).find(info => info.socketId == socket.id).channels; // Lay duoc danh sach cac kenh hien co cua user nay
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
                        channelId: channel,
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
            const listChannel = _profileConnected.get(senderId).find(info => info.socketId == socket.id).channels

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
            const senderChannelsId = _profileConnected.get(senderId).find(info => info.socketId == socket.id).channels // Lay duoc danh sach cac kenh hien co cua user nay
            if (senderChannelsId) {
                const listMessages = await loadMessagesHistory(data)
                // await socket.to(receiverId).emit('getMessagesHistory', listMessages[0].messages)

                if (listMessages[0].messages.length == 0) {
                    socket.emit('lastMessage', { info: 'No more older messages' })
                } else {

                    socket.emit('getMessagesHistory', listMessages[0])
                    console.log("object, ", listMessages[0]);

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

    
    //TAO KENH CHAT DON 
    socket.on("createSingleChat", async ({ receiverId, typeChannel }) => {
        try {
            const senderId = socket.auth.profileId
            //1. kiem tra loai channel de tao
            /*
             100 la public | 101 la public 1-1 | 201 la private 1-1
             200 la private | 102 la public group | 202 la private group
             999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
             */
            if (Number(typeChannel) != 101 && Number(typeChannel) != 102) {
                throw new Error("Invalid type channel 101 public 1-1 | 102 private 1-1")
            }

            const members = await [senderId, receiverId]
            //2. kiem tra channel 1-1 ton tai khi da tao
            await checkChannelSingleExists({ members, typeChannel })
            const dateNow = Date.now()

            //3. tao channel khi da du dieu kien
            const newSingleChannel = await ChannelModel.create(
                {
                    members: members.map(member => {
                        return {
                            profileId: member,
                            joinedDate: dateNow
                        }
                    }), typeChannel
                })
            if (!newSingleChannel) {
                throw new Error("Error creating single chat")
            }

            await newSingleChannel.members.map(async (member) => {
                const filter = { _id: member.profileId }
                const update = {
                    $push: { listChannels: { $each: [newSingleChannel._id], $position: 0 } }
                }
                await ProfileModel.findOneAndUpdate(filter, update, { new: true });
            })


            addNewChannel(newSingleChannel._id, socket) //Them group chat vao store server
            members.forEach( (member) => {

                 emitProfileId({ profileId: member, params: 'createdChannel', data: newSingleChannel }, io)  //Gui thong tin ve cac profileId co socket.id connect server
                /*
                
                Sau do o client hay them xu li nay de tham gia vao channel

                 socket.on('createdChannel', (channel) => {
                    console.log("id room duoc tao gui ve la ", channel);
                    socket.emit('joinChannel', channel._id)
                }) 
                
                */
            });


        } catch (error) {
            socket.emit('errorSocket', { status: error.status, message: error.message })
        }

    })

    //TAO GROUP CHAT
    socket.on("createGroupChat", async ({ members, typeChannel, name }) => {
        try {
            const senderId = socket.auth.profileId
            await members.push(senderId)

            if (members.length > 3) {
                throw new Error('Members must have at least 3 members')
            }
            //2. kiem tra loai channel de tao
            /*
             100 la public | 101 la public 1-1 | 201 la private 1-1
             200 la private | 102 la public group | 202 la private group
             999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
             */
            if (Number(typeChannel) == 201 && Number(typeChannel) == 202) {
                throw new Error("Invalid type channel 201 public 1-1 | 202 private 1-1")
            }

            //4. tao channel khi da du dieu kien
            const datedNow = Date.now()

            const newGroupChat = await ChannelModel.create({
                owner: senderId,
                name,
                members: members.map(member => {
                    return {
                        profileId: member,
                        joinedDate: datedNow
                    }
                }), typeChannel
            })
            addNewChannel(newGroupChat._id, socket) //Them group chat vao store server
            members.forEach((member) => {
                emitProfileId({ profileId: member, params: 'createdChannel', data: newGroupChat }, io) //Gui thong tin ve cac profileId co socket.id connect server
                /*
                
                Sau do o client hay them xu li nay de tham gia vao channel

                 socket.on('createdChannel', (channel) => {
                    console.log("id room duoc tao gui ve la ", channel);
                    socket.emit('joinChannel', channel._id)
                }) 
                
                */


            });

        } catch (error) {
            socket.emit('errorSocket', { message: error.message, status: error.status })
        }

    })


    //NGAT KET NOI 
    socket.on("disconnect", () => {
        //lay profileId tu headers thong qua authorization decode
        const profileId = socket.auth.profileId
        removeProfileConnect(profileId, socket)
        console.log(`A ${profileId} - ${socket.id} disconnected!`);
    });
});

module.exports = socketService;