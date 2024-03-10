const { accessChat } = require("../services/chat.service");
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

}


module.exports = new ChatController()