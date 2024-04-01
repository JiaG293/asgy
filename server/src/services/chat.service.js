const ProfileModel = require("../models/profile.model");
const MessageModel = require("../models/message.model");
const ChannelModel = require("../models/channel.model");
const { UnauthorizeError, BadRequestError } = require("../utils/responses/error.response");
const socketService = require("./socket1.service");
const mongoose = require("mongoose");
const { findProfileById } = require("./profile.service");

const accessChat = async (chat) => {
    const { userId } = await chat;

    if (!userId) {
        throw new UnauthorizeError("UserId not sent with request");
    }

    const isChat = await ChatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
    return "fsf"
}

const sendMessageOrigin = async ({ fromId, toId, typeMessage, messageContent, status }) => {

    const newMessage = await MessageModel.create({
        fromId,
        toId,
        typeMessage,
        messageContent,
        status
    });

    if (!newMessage) {
        throw new BadRequestError('Send message failed')
    }

    // const room = await ChannelModel.findOne({ owner: fromId, _id: fromId }).select('_id')

    _io.to(toId).emit('chat message', newMessage);

    return newMessage.messageContent

}

const sendMessage = async ({ senderId, receiverId, typeContent, messageContent }) => {

    const profile = await findProfileById(senderId)
    if (!profile) {
        throw new BadRequestError('Could not found profile')
    }

    const saveNewMessage = await MessageModel.create({
        senderId,
        receiverId,
        typeContent,
        messageContent,
    })

    const newMessage = saveNewMessage.populate({
        path: 'senderId', // ten field join
        select: 'avatar fullName' //cac truong duoc chon de lay ra 
    })

    if (!newMessage) {
        throw new BadRequestError('Send message failed')
    }

    return newMessage
}

const receiveMessage = async ({ fromId, toId, typeMessage, messageContent, status }) => {

    const newMessage = await MessageModel.create({
        fromId,
        toId,
        typeMessage,
        messageContent,
        status
    });

    if (!newMessage) {
        throw new BadRequestError('Send message failed')
    }

    console.log(newMessage);
    // const room = await ChannelModel.findOne({ owner: fromId, _id: fromId }).select('_id')

    _io.to(toId).emit('chat message', newMessage);

    return newMessage

}

const loadMessagesHistory = async ({ senderId, oldMessageId, receiverId }) => {
    //Cach nay khong dung group


    /* const message = await MessageModel.findById(oldMessageId).lean();
    console.log("message", message); */

    /* V1 Chua populate */
    /* const listMessagesHistory = await MessageModel.aggregate([
        // 1. Loc tin nhan theo receiverId va _id Messsage
        {
            $match: {
                $and: [
                    { receiverId: mongoose.Types.ObjectId(receiverId) },
                    { _id: mongoose.Types.ObjectId(oldMessageId) }
                ]
            }
        },
        // 2. so sanh createdAt cua tin nhan hien tai so voi cac tin trong b1
        {
            $lookup: {
                from: "Messages",
                let: { currentCreatedAt: "$createdAt" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$receiverId", mongoose.Types.ObjectId(receiverId)] },
                                    { $lt: ["$createdAt", "$$currentCreatedAt"] }
                                ]
                            }
                        }
                    },
                    { $sort: { createdAt: -1 } }, //Sap xep theo thu tu moi nhat - cu nhat de lay ra cac tin gan voi tin nhan cu nhat o client
                    { $limit: 2 }, // lay ra 2 tin gan nhat 
                    { $sort: { createdAt: 1 } } //sap xep chung lai theo thu tu cu nhat => moi nhat
                ],
                as: "messagesBefore"
            }
        },
        // 3. dinh dang lai cau truc tra ve
        {
            $project: {
                _id: "$receiverId",
                messages: "$messagesBefore"
            }
        }
    ]) */

    return await MessageModel.aggregate([
        // 1. Loc tin nhan theo receiverId va _id Messsage
        {
            $match: {
                $and: [
                    { receiverId: mongoose.Types.ObjectId(receiverId) },
                    { _id: mongoose.Types.ObjectId(oldMessageId) }
                ]
            }
        },

        // 2. so sanh createdAt cua tin nhan hien tai so voi cac tin trong b1
        {
            $lookup: {
                from: "Messages",
                let: { currentCreatedAt: "$createdAt" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$receiverId", mongoose.Types.ObjectId(receiverId)] },
                                    { $lt: ["$createdAt", "$$currentCreatedAt"] }
                                ]
                            }
                        }
                    },
                    { $sort: { createdAt: -1 } }, //Sap xep theo thu tu moi nhat - cu nhat de lay ra cac tin gan voi tin nhan cu nhat o client
                    { $limit: 50 }, // lay ra 2 tin gan nhat 
                    { $sort: { createdAt: 1 } }, //sap xep chung lai theo thu tu cu nhat => moi nhat
                    // populate de lay thong tin ca nhan tu collection profiles
                    {
                        $lookup: {
                            from: "Profiles",
                            localField: "senderId",
                            foreignField: "_id",
                            as: "senderInfo"
                        }
                    },
                    // unwind senderinfo ra de thay the 
                    { $unwind: "$senderInfo" },
                    //thay the truong senderInfo bang senderId
                    {
                        $addFields: {
                            senderId: "$senderInfo"
                        }
                    },
                    // xoa truong senderInfo di
                    { $unset: "senderInfo" },
                    // cho ra cac truong bao gom cac thong tin cua
                    {
                        $project: {
                            senderId: { avatar: 1, fullName: 1, _id: 1 },
                            receiverId: 1,
                            typeContent: 1,
                            messageContent: 1,
                            isDeleted: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            __v: 1
                        }
                    }
                ],
                as: "messagesBefore"
            }
        },

        // dinh dang lai thong tin cac truong de tra ve du lieu
        {
            $project: {
                _id: "$receiverId",
                messages: "$messagesBefore"
            }
        }
    ])





}



module.exports = {
    accessChat,
    sendMessage,
    loadMessagesHistory,


}