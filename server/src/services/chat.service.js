const ProfileModel = require("../models/profile.model");
const MessageModel = require("../models/message.model");
const ChannelModel = require("../models/channel.model");
const { UnauthorizeError, BadRequestError } = require("../utils/responses/error.response");
const socketService = require("./socket.service");

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

const sendMessage = async ({ fromId, toId, typeMessage, messageContent, status }) => {

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


module.exports = {
    accessChat,
    sendMessage,

}