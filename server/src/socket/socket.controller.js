
const SocketService = require("./socket.service");
const { addNewChannel, addProfileConnected, removeProfileConnect, emitProfileId, removeChannel, getOnlineProfile } = require("./socket.store");

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
            SocketService.statusProfile({ status: true }, socket)
            socket.emit('authorized', { message: "authorized", status: 200, metadata: { channels: channels } })
        }

        // xem trang thai cac socket hoat dong
        socket.on("test", () => {
            console.log("\n1. Socket id connected:::", socket.id)
            console.log("\n2. List Online:::", _profileConnected)
            console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms);
            console.log("\n3. UserId Map<SocketId, Set<Room>>:::", socket.adapter.sids)
        })

        // lay ra thong tin cac user hoat dong
        /* socket.on("userActiveRoom", (data) => {
            console.log("CHANNELS MAP<Room, Set<SocketId>:::", socket.adapter.rooms)
        })
 */
        //ngat ket noi socket
        socket.on("disconnect", () => {
            const profileId = socket.auth.profileId
            SocketService.statusProfile({ status: false }, socket) //cap nhat trang thai online
            removeProfileConnect(profileId, socket)
            console.log(`A ${profileId} - ${socket.id} disconnected!`);
        });

        socket.on("createSingleChat", async ({ receiverId, typeChannel, name }) => {
            try {
                const newSingleChannel = await SocketService.createSingleChat({ receiverId, typeChannel, name }, socket);
                addNewChannel(newSingleChannel._id, socket) //Them group chat vao store server
                newSingleChannel.members.forEach((member) => {
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
                console.log("error create single chat:", error);
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }

        })

        socket.on("createGroupChat", async ({ members, typeChannel, name, iconGroup }) => {
            try {
                const newGroupChat = await SocketService.createGroupChat({ members, typeChannel, name, iconGroup }, socket);

                addNewChannel(String(newGroupChat._id), socket) //Them group chat vao store server
                newGroupChat.members.forEach((member) => {
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
                console.log("error create group chat:", error);
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
                disbandGroupChat.members.forEach((member) => {
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
                console.log("error disband group:", error);
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
                addNewMembers.newMembers.forEach((newMember) => {
                    emitProfileId({
                        profileId: newMember.profileId,
                        params: 'addedMembers',
                        data: addNewMembers.channel
                    }, _io);
                });
                socket.emit("addMembers", { status: true, message: "Added members successfully" })
            } catch (error) {
                console.log("error add members:", error);
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


                deleteMembers.members.forEach((member) => {
                    emitProfileId({
                        profileId: member,
                        params: 'removedMember',
                        data: {
                            message: "Bạn đã bị loại khỏi nhóm",
                            status: true,
                            channelId: channelId,
                        }
                    }, _io);
                    removeChannel(channelId, member)
                })
            } catch (error) {
                console.log("error delete members:", error);
                socket.emit("errorSocket", {
                    status: error.status,
                    message: error.message,
                })
            }
        })


        //Send message to channel
        socket.on('sendMessage', async ({ receiverId, typeContent, messageContent }) => {
            try {
                const sendNewMessage = await SocketService.sendMessage({ receiverId, typeContent, messageContent }, socket)


                await _io.to(receiverId).emit("getMessage", {
                    ...sendNewMessage,
                    status: true,
                });
            } catch (error) {
                console.log(error);
                socket.emit("errorSocket", {
                    status: error?.status,
                    message: error?.message,
                })
            }
        })

        socket.on('loadMessages', async () => {
            await SocketService.loadMessages(socket)
        })


        //Load messages history
        socket.on('loadMessagesHistory', async ({ oldMessageId, receiverId }) => {
            try {
                const listMessages = await SocketService.loadMessagesHistory({ oldMessageId, receiverId }, socket)
                if (listMessages[0].messages.length == 0) {
                    socket.emit('lastMessage', { info: 'No more older messages' })
                } else {

                    socket.emit('getMessagesHistory', listMessages[0])
                    console.log("\n\nList message:, ", listMessages[0]);

                }
            } catch (error) {
                console.log("error load messages history:", error);
            }
        })

        //Forward message from channel
        socket.on('forwardMessage', async ({ messageData, receiverId }) => {
            try {
                const forwardMessage = await SocketService.forwardMessage({ messageData, receiverId }, socket)


                await _io.to(receiverId).emit("getMessage", {
                    ...forwardMessage,
                    STATUS: "SUCCESS",
                });
            } catch (error) {
                console.log("error forward message:", error);
            }
        })

        //Remove message from channel
        socket.on('removeMessage', async ({ messageId }) => {
            try {
                const removeMessage = await SocketService.removeMessage({ messageId });

                if (removeMessage) {
                    console.log("remove mess id:", removeMessage, "\n receiver: ", removeMessage.receiverId);
                    _io.to(String(removeMessage.receiverId)).emit("messageRemoved", { ...removeMessage, status: true });
                } else {
                    socket.emit("messageRemoved", { message: "Only delete messages sent within 24 hours or message is revoked | removed", status: false })

                }
            } catch (error) {
                console.error("Error loading message:", error);
            }
        })

        //Revoke messasge
        socket.on('revokeMessage', async ({ messageId }) => {

            try {
                const revokeMessage = await SocketService.revokeMessage({ messageId });

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


        //On typing messasge
        socket.on('onTyping', async ({ channelId, fullName, isTyping }) => {
            await SocketService.typingMessage({ channelId, fullName, isTyping }, socket)
        })




















    }


}


module.exports = new SocketController()