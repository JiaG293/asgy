const { message } = require("../controllers/socket.controller");
const { SuccessResponse } = require("../utils/responses/success.response");
const SocketService = require("./socket.service");
const { addNewChannel, addProfileConnected, removeProfileConnect, emitProfileId, removeChannel } = require("./socket.store");

class SocketController {


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

        socket.on("createSingleChat", async ({ receiverId, typeChannel, name }) => {
            try {
                const newSingleChannel = await SocketService.createSingleChat({ receiverId, typeChannel, name }, socket);
                addNewChannel(newSingleChannel.metadata._id, socket) //Them group chat vao store server
                newSingleChannel.metadata.members.forEach((member) => {
                    emitProfileId({ profileId: member.profileId, params: 'createdChannel', data: newSingleChannel }, _io)  //Gui thong tin ve cac profileId co socket.id connect server
                    /*
                    
                    Sau do o client hay them xu li nay de tham gia vao channel
        
                     socket.on('createdChannel', (channel) => {
                        console.log("id room duoc tao gui ve la ", channel);
                        socket.emit('joinChannel', channel._id)
                    }) 
                    
                    */
                });
            } catch (error) {
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }

        })

        socket.on("createGroupChat", async ({ members, typeChannel, name, iconGroup }) => {
            try {
                const newGroupChat = await SocketService.createGroupChat({ members, typeChannel, name, iconGroup }, socket);

                addNewChannel(String(newGroupChat.metadata._id), socket) //Them group chat vao store server
                newGroupChat.metadata.members.forEach((member) => {
                    emitProfileId({ profileId: member.profileId, params: 'createdChannel', data: newGroupChat }, _io)  //Gui thong tin ve cac profileId co socket.id connect server
                    /*
                    
                    Sau do o client hay them xu li nay de tham gia vao channel
             
                     socket.on('createdChannel', (channel) => {
                        console.log("id room duoc tao gui ve la ", channel);
                        socket.emit('joinChannel', channel._id)
                    }) 
                    
                    */
                });
            } catch (error) {
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }
        })

        socket.on("joinChannel", ({ channelId }) => {
            socket.join(String(channelId))
        })

        // disband group
        socket.on('disbandGroup', async ({ channelId }) => {
            try {
                const disbandGroupChat = await SocketService.disbandGroup({ channelId }, socket)
                console.log("disbandGroup", disbandGroupChat);
                disbandGroupChat.metadata.members.forEach((member) => {
                    emitProfileId({ profileId: member.profileId, params: 'disbanedGroup', data: { channelId: channelId, message: "Nhóm đã bị giải tán", status: true } }, _io) //Gui thong tin ve cac profileId co socket.id connect server

                    /*
                    
                    Sau do o client hay them xu li nay de tham gia vao channel
     
                     socket.on('disbanedGroup', (channel) => {
                        console.log("id room duoc tao gui ve la ", channel);
                        Xu li thong tin khong frontend o day
                    }) 
                    
                    */
                });
            } catch (error) {
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }
        })

        // add member to group
        socket.on('addMembers', async ({ channelId, members }) => {
            try {
                const addNewMembers = await SocketService.addMembers({ channelId, members }, socket)
                addNewMembers.metadata.newMembers.forEach((newMember) => {
                    emitProfileId({
                        profileId: newMember.profileId,
                        params: 'addedMembers',
                        data: addNewMembers.metadata.channel
                    }, _io);
                });
                socket.emit("addMembers", { status: "OK", message: "Added members successfully" })
            } catch (error) {
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }
        })

        //Delete members from group
        socket.on('deleteMembers', async ({ channelId, members }) => {
            try {
                const deleteMembers = await SocketService.deleteMembers({ channelId, members }, socket)


                deleteMembers.metadata.members.forEach((member) => {
                    emitProfileId({
                        profileId: member,
                        params: 'removedMember',
                        data: {
                            message: "Bạn đã bị loại khỏi nhóm",
                            status: 200,
                            metadata: {
                                channelId: channelId,
                            }
                        }
                    }, _io);
                    removeChannel(channelId, member)
                })
            } catch (error) {
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }
        })


        //Send message to channel
        socket.on('sendMessage', async ({ receiverId, typeContent, messageContent }) => {
            const sendNewMessage = await SocketService.sendMessage({ receiverId, typeContent, messageContent }, socket)

            await _io.to(receiverId).emit("getMessage", {
                ...sendNewMessage,
                STATUS: "SUCCESS",
            });
        })

        socket.on('loadMessages', async () => {
            await SocketService.loadMessages(socket)
        })


        //Load messages history
        socket.on('loadMessagesHistory', async ({ oldMessageId, receiverId }) => {
            const listMessages = await SocketService.loadMessagesHistory({ oldMessageId, receiverId }, socket)
            if (listMessages[0].messages.length == 0) {
                socket.emit('lastMessage', { info: 'No more older messages' })
            } else {

                socket.emit('getMessagesHistory', listMessages[0])
                console.log("\n\nList message:, ", listMessages[0]);

            }
        })

        //Forward message from channel
        socket.on('forwardMessage', async ({ messageId, receiverId }) => {

        })

        //Remove message from channel
        socket.on('removeMessage', async ({ messageId }) => {
            try {
                const removeMessage = await SocketService.removeMessage({ messageId });

                if (removeMessage) {
                    console.log("remove mess id:", removeMessage, "\n receiver: ", removeMessage.receiverId);
                    _io.to(String(removeMessage.receiverId)).emit("messageRemoved", { ...removeMessage, status: true });
                } else {
                    console.log("error: delete message is not exist");

                }
            } catch (error) {
                console.error("Error loading message:", error);
            }
        })

        //Revoke messasge
        socket.on('revokeMessage', async ({ messageId }) => {

            try {
                const revokeMessage = await SocketService.revokeMessage({messageId});

                if (revokeMessage) {
                    console.log("revoke mess id", revokeMessage, "\n receiver: ", revokeMessage.receiverId);
                    _io.to(String(revokeMessage.receiverId)).emit("messageRevoked", { ...revokeMessage, status: true });
                } else {
                    console.log("error: revoke message is not exist");
                    throw new Error("error revoke message")
                }
            } catch (error) {
                console.error("Error loading message:", error);
            }
        })














    }





}


module.exports = new SocketController()


/*













//  MESSAGE 

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
} */