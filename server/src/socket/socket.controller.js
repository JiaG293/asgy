const { accessChat, sendMessage, sendVideo, sendImage, sendDocument, sendFiles } = require("../services/chat.service");
const { createSingleChat, createGroupChat, findChannelByUserId, checkChannelSingleExists, getListChannels, getDetailsChannel } = require("../services/channel.service");
const { SuccessResponse } = require("../utils/responses/success.response");

class SocketController {


    authSocket = async (req, res, next) => {
        new SuccessResponse({
            message: 'Connected to chat',
            metadata: await,
        }).send(res)
    }
    /* CHANNEL */

    //create single chat
    createSingleChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created single chat',
            metadata: await ,
        }).send(res)
    }

    //create group chat
    createGroupChat = async (req, res, next) => {
        new SuccessResponse({
            message: 'Created group chat',
            metadata: await ,
        }).send(res)
    }

    //join channel
    joinChannel = async (req, res, next) => {
        new SuccessResponse({
            message: 'Find channel',
            metadata: await ,
        }).send(res)
    }

    // disband group
    disbandGroup = async (req, res, next) => {
        new SuccessResponse({
            message: 'Receive message success',
            metadata: await ,
        }).send(res)
    }











    /* PROFILE */

    // add members group
    addMembers = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send image success',
            metadata: await ,
        }).send(res)
    }

    // delete members group
    deleteMembers = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send video success',
            metadata: await ,
        }).send(res)
    }









    /* MESSAGE */

    // load messages
    loadMessages = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get sucessfully channel list',
            metadata: await ,
        }).send(res)
    }

    // load messages history
    loadMessagesHistory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get detail channel',
            metadata: await ,
        }).send(res)
    }

    // send messsage 
    sendMessage = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send message success',
            metadata: await ,
        }).send(res)
    }

    //revoke messasge
    revokeMessage = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send document success',
            metadata: await ,
        }).send(res)
    }

    //remove message
    removeMessage = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send file success',
            metadata: ,
        }).send(res)
    }

    // forward messsage 
    forwardMessage = async (req, res, next) => {
        new SuccessResponse({
            message: 'Send message success',
            metadata: await ,
        }).send(res)
    }

    connection(socket) {

        console.log("\n### Socket id connected:::", socket.id)

        //xac thuc thong tin 
        console.log("\n### socket user sau khi da xac thuc: \n", socket.auth);
        if (socket.auth === undefined) {
            socket.emit('errorAuthenticate', { message: "authorization failed", status: 401 });
            socket.disconnect(socket.id)
        } else {
            const profileId = socket.auth.profileId
            const channels = socket.channels
            console.log("channel", channels);
            addProfileConnected({ profileId: profileId, channels: channels }, socket);
            socket.emit('authorized', { message: "authorized", status: 200, metadata: { channels: channels } })
        }

        // xem trang thai cac socket hoat dong
        socket.on("test", () => {
            console.log("\n1. Socket id connected:::", socket.id)
            console.log("\n2. List Online:::", _profileConnected)
            // console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms);
            console.log("\n3. UserId Map<SocketId, Set<Room>>:::", socket.adapter.sids)
        })

        // lay ra thong tin cac user hoat dong
        socket.on("userActiveRoom", (data) => {
            console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms)
        })

        //ngat ket noi socket
        socket.on("disconnect", () => {
            const profileId = socket.auth.profileId
            removeProfileConnect(profileId, socket)
            console.log(`A ${profileId} - ${socket.id} disconnected!`);
        });

       










    }





}


module.exports = new ChatController()