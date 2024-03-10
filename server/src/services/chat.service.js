const ProfileModel = require("../models/profile.model");
const MessageModel = require("../models/message.model");
const ChannelModel = require("../models/channel.model");
const { UnauthorizeError } = require("../utils/responses/error.response");

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


module.exports = {
    accessChat

}