const { accessChat, sendMessage } = require("../services/chat.service");
const { createSingleChat, createGroupChat, findChannelByUserId, checkChannelSingleExists, getListChannels, getDetailsChannel} = require("../services/channel.service");
const { CREATED, SuccessResponse } = require("../utils/responses/success.response");

class ChatController {

    //connected chat
    accessChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Connected to chat',
            metadata: await accessChat(req.body)
        }).send(res)
    }

    createSingleChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created single chat',
            metadata: await createSingleChat(req)
        }).send(res)
    }

    createGroupChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created group chat',
            metadata: await createGroupChat(req)
        }).send(res)
    }

    findChannel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find channel',
            metadata: await findChannelByUserId(req.body)
        }).send(res)
    }

    getListChannels = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get sucessfully channel list',
            metadata: await getListChannels(req.headers)
        }).send(res)
    }

    getDetailsChannel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get detail channel',
            metadata: await getDetailsChannel(req)
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