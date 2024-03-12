const { accessChat, sendMessage } = require("../services/chat.service");
const { createPublicChannel, findChannelByUserId, checkChannelExists } = require("../services/channel.service");
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class ChatController {

    //connected chat
    accessChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Connected to chat',
            metadata: await accessChat(req.body)
        }).send(res)
    }

    createChanel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created channel',
            metadata: await createPublicChannel(req.body)
        }).send(res)
    }

    findChannel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find channel',
            metadata: await checkChannelExists(req.body)
        }).send(res)
    }

    sendMessage = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send message success',
            metadata: await sendMessage(req.body)
        }).send(res)
    }

    receiveMessage = async (req, res, next) => {
        new SuccessResponse({
            message: 'Receive message success',
            metadata: await checkChannelExists(req.body)
        }).send(res)
    }


}


module.exports = new ChatController()