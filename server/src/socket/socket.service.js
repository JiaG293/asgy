const ChannelModel = require("../models/channel.model");
const ProfileModel = require("../models/profile.model");
const { checkChannelSingleExists } = require("../services/channel.service");
const { ConflictRequestError, BadRequestError } = require("../utils/responses/error.response");
const { removeProfileConnect, addProfileConnected } = require("./socket.store");


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    X_CLIENT_ID: 'x-client-id',
}

class SocketService {
    /* CHANNEL */

    //create single chat
    static createSingleChat = async ({ receiverId, typeChannel, name }, socket) => {
        //1. kiem tra loai channel de tao
        /*
         100 la public | 101 la public 1-1 | 102 la private 1-1
         200 la private | 201 la public group | 202 la private group
         999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
         */
        //2. kiem tra channel 1-1 ton tai khi da tao
        //3. tao channel khi da du dieu kien
        //4. them id channel vao profiles

        const senderId = socket.auth.profileId
        await name ?? undefined

        if (receiverId == senderId) {
            throw new ConflictRequestError("Cant not create single chat with yourself")
        }

        if (Number(typeChannel) != 101 && Number(typeChannel) != 102) {
            throw new BadRequestError("Invalid type channel 101 public 1-1 | 102 private 1-1")
        }

        const members = await [senderId, receiverId]

        const channelExist = await checkChannelSingleExists({ members, typeChannel })
        console.log("channel ton tai la:", channelExist);
        if (channelExist) {

            //xu li phan cap nhat dau mang
            return {
                metadata: channelExist,
                status: "EXIST",
            }
        } else {
            const dateNow = Date.now()
            const newSingleChannel = await ChannelModel.create(
                {
                    members: members.map(member => {
                        return {
                            profileId: member,
                            joinedDate: dateNow
                        }
                    }), typeChannel,
                    name,
                })


            if (!newSingleChannel) {
                throw new BadRequestError("Error creating single chat")
            }

            // them channel vao list channel profile
            for (const member of newSingleChannel.members) {
                const filter = { _id: member.profileId };
                const update = {
                    $push: { listChannels: { $each: [newSingleChannel._id], $position: 0 } }
                };

                try {
                    await ProfileModel.findOneAndUpdate(filter, update, { new: true });
                } catch (error) {
                    throw new BadRequestError(`Error updating member on database ${member.profileId}: ${error}`);
                }
            }
            return {
                metadata: newSingleChannel,
                status: "NEW"
            }
        }

    }

    //create group chat
    static createGroupChat = async ({ members, typeChannel, name, iconGroup }, socket) => {
        const senderId = socket.auth.profileId

        await iconGroup ?? undefined
        await members.push(senderId)

        const uniqueMembers = new Set(members);
        if (uniqueMembers.size !== members.length) {
            throw new ConflictRequestError('480: duplicate memberId');
        }

        if (members.length < 3) {
            throw new BadRequestError('Must have at least 3 members')
        }

        if (Number(typeChannel) == 201 && Number(typeChannel) == 202) {
            throw new BadRequestError("Invalid type channel 201 public 1-1 | 202 private 1-1")
        }

        const datedNow = Date.now()

        const newGroupChat = await ChannelModel.create({
            owner: senderId,
            name,
            members: members.map(member => {
                return {
                    profileId: member,
                    joinedDate: datedNow
                }
            }),
            typeChannel,
            iconGroup
        })
        for (const member of newGroupChat.members) {
            const filter = { _id: member.profileId };
            const update = {
                $push: { listChannels: { $each: [newGroupChat._id], $position: 0 } }
            };

            try {
                await ProfileModel.findOneAndUpdate(filter, update, { new: true });
            } catch (error) {
                throw new BadRequestError(`Error updating member ${member.profileId}: ${error}`);
            }
        }

        return newGroupChat;
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

module.exports = SocketService