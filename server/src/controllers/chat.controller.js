const { accessChat, sendMessage } = require("../services/chat.service");
const { createSingleChat, findChannelByUserId, checkChannelSingleExists, getListChannels } = require("../services/channel.service");
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

    createChannelChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created channel chat',
            metadata: await createSingleChat(req.body)
        }).send(res)
    }

    findChannel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find channel',
            metadata: await createSingleChat(req.body)
        }).send(res)
    }

    getListChannels = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get sucessfully channel list',
            metadata: await getListChannels(req.headers)
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