const { removeProfileConnect, addProfileConnected } = require("./socket.store");


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    X_CLIENT_ID: 'x-client-id',
}

class SocketService {
    /* CHANNEL */

    //create single chat
    createSingleChat = async ({ receiverId, typeChannel, name }) => {

    }

    //create group chat
    createGroupChat = async ({ members, typeChannel, name, iconGroup }) => {

    }

    //join channel
    joinChannel = async ({ channelId }) => {

    }

    // disband group
    disbandGroup = async ({ channelId }) => {

    }











    /* PROFILE */

    // add members group
    addMembers = async ({ channelId, members }) => {

    }

    // delete members group
    deleteMembers = async ({ channelId, members }) => {

    }









    /* MESSAGE */

    // load messages
    loadMessages = async ({ profileId }) => {

    }

    // load messages history
    loadMessagesHistory = async ({ oldMessageId, receiverId }) => {

    }

    // send messsage 
    sendMessage = async ({ receiverId, typeContent, messageContent, STATUS }) => {

    }

    //revoke messasge
    revokeMessage = async ({ messageId }) => {

    }

    //remove message
    removeMessage = async ({ messageId }) => {

    }

    // forward messsage 
    forwardMessage = async ({ listReceiverId }) => {

    }



}