const ChannelModel = require("../models/channel.model");
const ProfileModel = require("../models/profile.model");
const { checkChannelSingleExists } = require("../services/channel.service");
const { ConflictRequestError, BadRequestError, UnauthorizeError } = require("../utils/responses/error.response");
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
    static joinChannelByLink = async ({ channelId }, socket) => {

    }

    // disband group
    static disbandGroup = async ({ channelId }, socket) => {
        const senderId = socket.auth.profileId

        const channel = await ChannelModel.findOne({ _id: channelId }).select('members owner').lean()
        if (!channel) {
            throw new BadRequestError("Channel not found")
        }

        if (String(channel.owner) !== senderId) {
            throw new UnauthorizeError("You do not permission disband group")
        }

        const filter = { _id: channelId };
        const update = { isDisbanded: true };
        const options = { new: true };
        const disbandGroup = await ChannelModel.findOneAndUpdate(filter, update, options);

        if (!disbandGroup) {
            throw new BadRequestError('Channel not found or could not be updated.');
        } else {
            console.log('isDisbanded has been updated successfully.');

            channel.members.forEach(async (mem) => {
                await ProfileModel.findOneAndUpdate(
                    { _id: mem.profileId },
                    { $pull: { listChannels: channelId } },
                    { new: true }
                );
            })

            return {
                status: "OK",
                metadata: disbandGroup
            }
        }
    }

    //add members group
    static addMembers = async ({ channelId, members }, socket) => {
        const senderId = socket.auth.profileId;

        const channel = await ChannelModel.findOne({ _id: channelId }).select('members owner').lean();
        if (!channel) {
            throw new Error("Channel not found");
        }

        if (String(channel.owner) !== senderId) {
            throw new Error("You do not have permission to add members to this channel");
        }

        const membersUpdate = [];
        const dateNow = Date.now()
        members.forEach((newMember) => {
            const existingMember = channel.members.find((mem) => String(mem.profileId) === String(newMember));
            if (existingMember) {
                throw new ConflictRequestError(`Member ${newMember.profileId} already exists in the channel`);
            } else {
                membersUpdate.push({ profileId: newMember, joinedDate: dateNow });
            }
        });

        const filter = { _id: channelId };
        const update = { $push: { members: { $each: membersUpdate } } };
        const options = { new: true };
        const updatedChannel = await ChannelModel.findOneAndUpdate(filter, update, options);
        console.log("updatedChannel", updatedChannel);

        if (!updatedChannel) {
            throw new BadRequestError('Channel not found or could not be updated.');
        } else {
            for (const mem of membersUpdate) {
                const filter = { _id: mem.profileId };
                const update = {
                    $push: { listChannels: { $each: [String(channel._id)], $position: 0 } }
                };

                try {
                    await ProfileModel.findOneAndUpdate(filter, update, { new: true });
                } catch (error) {
                    throw new BadRequestError(`Error updating member ${mem.profileId}: ${error}`);
                }
            }
            console.log('Member added to the channel successfully.');
            return {
                status: "OK",
                metadata: {
                    channel: updatedChannel,
                    newMembers: membersUpdate,
                }
            }
        }
    }

    //Delete members group
    static deleteMembers = async ({ channelId, members }, socket) => {
        const senderId = socket.auth.profileId;

        const channel = await ChannelModel.findOne({ _id: channelId }).select('members owner').lean();
        if (!channel) {
            throw new Error("Channel not found");
        }

        if (String(channel.owner) !== senderId) {
            throw new Error("You do not have permission to remove members from this channel");
        }


        const filter = { _id: channelId };
        const update = { $pull: { members: { profileId: memberId } } };
        const options = { new: true };
        const updatedChannel = await ChannelModel.findOneAndUpdate(filter, update, options);

        if (!updatedChannel) {
            throw new Error('Channel not found or could not be updated.');
        } else {
            console.log('Member removed from the channel successfully.');

            const profileUpdate = await ProfileModel.findOneAndUpdate(
                { _id: memberId },
                { $pull: { listChannels: channelId } },
                { new: true }
            );


            emitProfileId({
                profileId: memberId,
                params: 'removedMember',
                data: {
                    message: "Bạn đã bị loại khỏi nhóm",
                    status: 200,
                    metadata: {
                        channelId: channelId,
                    }
                }
            }, io);
        }
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