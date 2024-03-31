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

    /*  return await MessageModel.aggregate([
         {
             $group: {
                 _id: mongoose.Types.ObjectId(receiverId), // channel can duoc nhom de lay tin nhan
                 messages: { $push: "$$ROOT" }
             }
         },
         {
             $project: {
                 messages: {
                     $filter: {
                         input: "$messages",
                         as: "message",
                         cond: { $lt: ["$$message._id", mongoose.Types.ObjectId(oldMessageId)] } //tin nhan cu nhat trong cuoc hoi thoai da co tren client
                     }
                 }
             }
         },
         { $limit: 3 }
     ]) */

    return await MessageModel.aggregate([
        {
            $group: {
                _id: mongoose.Types.ObjectId(receiverId),
                messages: { $push: "$$ROOT" }
            }
        },
        {
            $project: {
                messages: {
                    $filter: {
                        input: "$messages",
                        as: "message",
                        cond: { $lt: ["$$message._id", mongoose.Types.ObjectId(oldMessageId)] }
                    }
                }
            }
        },
        {
            $project: {
                messages: {
                    $slice: [
                        {
                            $map: {
                                input: "$messages",
                                as: "message",
                                in: {
                                    _id: "$$message._id",
                                    messageContent: "$$message.messageContent"
                                }
                            }
                        },
                        3
                    ]
                }
            }
        }
    ])
}



module.exports = {
    accessChat,
    sendMessage,
    loadMessagesHistory,


}