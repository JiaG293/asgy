const { default: mongoose } = require("mongoose");
const { message } = require("../controllers/socket.controller");
const ChannelModel = require("../models/channel.model");
const MessageModel = require("../models/message.model");
const ProfileModel = require("../models/profile.model");
const { checkChannelSingleExists } = require("../services/channel.service");
const { findProfileById } = require("../services/profile.service");
const { ConflictRequestError, BadRequestError, UnauthorizeError } = require("../utils/responses/error.response");
const { removeProfileConnect, addProfileConnected, emitProfileId } = require("./socket.store");
const { pushNotification } = require("../services/notification.service");


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
        const update = { $pull: { members: { profileId: { $in: members } } } };
        const options = { new: true };
        const updatedChannel = await ChannelModel.findOneAndUpdate(filter, update, options);

        if (!updatedChannel) {
            throw new Error('Channel not found or could not be updated.');
        } else {
            console.log('Member removed from the channel successfully.');

            await ProfileModel.updateMany(
                { _id: { $in: members } },
                { $pull: { listChannels: channelId } }
            );

        }

        return {
            status: "OK",
            metadata: {
                members
            }
        }
    }
    // send messsage 
    static sendMessage = async ({ receiverId, typeContent, messageContent }, socket) => {
        const senderId = socket.auth.profileId
        const profile = await findProfileById(senderId)
        if (!profile) {
            throw new Error('Could not found profile')
        }

        const saveNewMessage = await MessageModel.create({
            senderId,
            receiverId,
            typeContent,
            messageContent: messageContent ?? "",
        })



        if (!saveNewMessage) {
            throw new Error('Send message failed')
        } else {
            const newMessage = await saveNewMessage.populate({
                path: 'senderId', // ten field join
                select: 'avatar fullName' //cac truong duoc chon de lay ra 
            }).then(result => ({
                ...result._doc,
                senderId: result._doc.senderId._id,
                fullName: result._doc.senderId.fullName,
                avatar: result._doc.senderId.avatar
            }))
            await ChannelModel.findOneAndUpdate(
                { _id: receiverId },
                { lastMessage: newMessage._id },
                { new: true }
            )

            //Thong bao den user
            await ChannelModel.findById(receiverId)
                .select('typeChannel members name')
                .populate({
                    path: 'members',
                    populate: {
                        path: 'profileId',
                        select: '_id fullName avatar'
                    }
                })
                .lean()
                .then(result => {
                    console.log(result);
                    let notificationType;
                    if (result.typeChannel === 101 || result.typeChannel === 102) {
                        notificationType = 'MESSAGE_SINGLE'
                    } else if (result.typeChannel === 201 || result.typeChannel === 202) {
                        notificationType = 'MESSAGE_GROUP'
                    }
                    result.members.forEach(member => {
                        console.log("meme fsdfsfsf", member);
                        let name, fullName, avatar, iconGroup;
                        if (result.typeChannel === 101 || result.typeChannel === 102) {
                            fullName = member.profileId.fullName
                            avatar = member.profileId.avatar
                        } else if (result.typeChannel === 201 || result.typeChannel === 202) {
                            name = result.name;
                            iconGroup = result.iconGroup;
                        }

                        pushNotification({
                            notificationType: notificationType,
                            notificationSenderId: senderId,
                            notificationReceiverId: member.profileId._id,
                            options: {
                                fullName, //ten cua nguoi gui - neu la message_single
                                avatar, // anh dai dien - neu la message_single

                                iconGroup, //anh dai dien cua message_group
                                name, //ten cua group - neu la message_group
                            }
                        })
                    })
                })
                .catch(err => console.log(err))



            console.log("tin nhan duoc luu vao database", newMessage);
            return newMessage
        }

        // await socket.to(receiverId).emit("getMessage", newMessage);
        // await socket.emit("getMessage", newMessage);
    }

    // load messages
    static loadMessages = async (socket) => {
        const profileId = socket.auth.profileId
        const senderChannelsId = _profileConnected.get(profileId).channels
        if (senderChannelsId) {
            senderChannelsId.map(async (channel) => {

                const messages = await MessageModel.find({
                    receiverId: channel,
                    isRemoved: false,
                })
                    .sort({ createdAt: -1 }) //sap xep thu tu tin moi nhat xep truoc 
                    .limit(50)
                    .populate({
                        path: 'senderId', // ten field join
                        select: 'avatar fullName' //cac truong duoc chon de lay ra 
                    })
                    .lean()
                    .then(result => (
                        result.map((message) => ({
                            ...message,
                            senderId: message.senderId._id,
                            fullName: message.senderId.fullName,
                            avatar: message.senderId.avatar
                        }))
                    ))
                console.log("\nChannel:", channel, "\nMessages length:", messages.length);
                socket.emit('getMessages', {
                    channelId: channel,
                    messages: [...messages.reverse()]
                })
            })
        }

    }

    static loadMessagesHistory = async ({ oldMessageId, receiverId }, socket) => {

        const senderId = socket.auth.profileId
        const senderChannelsId = _profileConnected.get(senderId).channels // Lay duoc danh sach cac kenh hien co cua user nay
        if (senderChannelsId) {
            return await MessageModel.aggregate([
                // 1. Lọc tin nhắn theo receiverId và _id Message
                {
                    $match: {
                        $and: [
                            { receiverId: mongoose.Types.ObjectId(receiverId) },
                            { _id: mongoose.Types.ObjectId(oldMessageId) },
                            { isRemoved: false },
                        ]
                    }
                },

                // 2. So sánh createdAt của tin nhắn hiện tại với các tin trong bước trước
                {
                    $lookup: {
                        from: "Messages",
                        let: { currentCreatedAt: "$createdAt" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$receiverId", mongoose.Types.ObjectId(receiverId)] },
                                            { $lt: ["$createdAt", "$$currentCreatedAt"] }
                                        ]
                                    }
                                }
                            },
                            { $sort: { createdAt: -1 } }, // Sắp xếp theo thứ tự mới nhất - cũ nhất để lấy ra các tin gần với tin nhắn cũ nhất ở client
                            { $limit: 50 }, // Lấy ra 50 tin gần nhất 
                            { $sort: { createdAt: 1 } }, // Sắp xếp chúng lại theo thứ tự cũ nhất => mới nhất
                            // Populate để lấy thông tin cá nhân từ collection Profiles
                            {
                                $lookup: {
                                    from: "Profiles",
                                    localField: "senderId",
                                    foreignField: "_id",
                                    as: "senderInfo"
                                }
                            },
                            // Unwind senderInfo ra để thay thế
                            { $unwind: "$senderInfo" },
                            // Thay thế trường senderInfo bằng senderId
                            {
                                $addFields: {
                                    senderId: "$senderInfo._id",
                                    avatar: "$senderInfo.avatar",
                                    fullName: "$senderInfo.fullName",
                                }
                            },
                            // Xóa trường senderInfo đi
                            { $unset: "senderInfo" }
                        ],
                        as: "messagesBefore"
                    }
                },

                // 3. Định dạng lại thông tin các trường để trả về dữ liệu
                {
                    $project: {
                        channelId: "$receiverId",
                        messages: {
                            $map: {
                                input: "$messagesBefore",
                                as: "message",
                                in: {
                                    _id: "$$message._id",
                                    senderId: "$$message.senderId",
                                    avatar: "$$message.avatar",
                                    fullName: "$$message.fullName",
                                    receiverId: "$$message.receiverId",
                                    typeContent: "$$message.typeContent",
                                    messageContent: "$$message.messageContent",
                                    isDeleted: "$$message.isDeleted",
                                    createdAt: "$$message.createdAt",
                                    updatedAt: "$$message.updatedAt",
                                    __v: "$$message.__v"
                                }
                            }
                        }
                    }
                }
            ])


            // await socket.to(receiverId).emit('getMessagesHistory', listMessages[0].messages)

        }
    }


    //revoke messasge
    static revokeMessage = async ({ messageId }) => {
        const revokeMessage = await MessageModel.findOneAndUpdate(
            { _id: messageId, },
            {
                $set: {
                    messageContent: "Tin nhắn đã được thu hồi",
                    typeContent: "REVOKE_MESSAGE",
                    isRevoked: true,
                }
            },
            { new: true, })
            .populate({
                path: 'senderId', // ten field join
                select: 'avatar fullName' //cac truong duoc chon de lay ra 
            })
            .lean()
            .then(result => ({
                ...result,
                senderId: result.senderId._id,
                fullName: result.senderId.fullName,
                avatar: result.senderId.avatar
            }))
        return revokeMessage
    }

    //remove message
    static removeMessage = async ({ messageId }) => {
        const currentDate = new Date();
        const twentyFourHoursAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000)); // Trừ 24 giờ


        const deleteMessage = await MessageModel.findOneAndUpdate(
            {
                _id: messageId,
                isRemoved: false,
                createdAt: { $lt: currentDate.toISOString(), $gte: twentyFourHoursAgo.toISOString() },
            },
            {
                $set: {
                    typeContent: "REMOVE_MESSAGE",
                    isRemoved: true,
                }
            },
            { new: true, })
            .populate({
                path: 'senderId', // ten field join
                select: 'avatar fullName' //cac truong duoc chon de lay ra 
            })
            .lean()
            .then(result => {
                if (result) {
                    return ({
                        ...result,
                        senderId: result.senderId._id,
                        fullName: result.senderId.fullName,
                        avatar: result.senderId.avatar
                    })
                }
            })
            .catch(error => console.log("error service remove message:", error))
        return deleteMessage
    }

    // forward messsage 
    static forwardMessage = async ({ messageData, receiverId }, socket) => {
        const senderId = socket.auth.profileId
        const profile = await findProfileById(senderId)
        if (!profile) {
            throw new Error('Could not found profile')
        }
        if (!messageDat && !receiverId) {
            throw new Error('Not exist params for forward message')
        }

        const saveNewMessage = await MessageModel.create({
            senderId,
            receiverId,
            typeContent: 'FOWARD_MESSAGE',
            messageContent: messageData?.messageContent ?? "",
            messageOriginalId: messageData._id,
        })



        if (!saveNewMessage) {
            throw new Error('Send message failed')
        } else {
            const newMessage = await saveNewMessage
                .populate({
                    path: 'messageOriginalId',
                    select: '_id senderId'
                })
                .populate({
                    path: 'senderId', // ten field join
                    select: 'avatar fullName' //cac truong duoc chon de lay ra 
                }).then(result => ({
                    ...result._doc,
                    senderId: result._doc.senderId._id,
                    fullName: result._doc.senderId.fullName,
                    avatar: result._doc.senderId.avatar
                }))
                .catch(error => console.log("error foward message:", error))
            await ChannelModel.findOneAndUpdate(
                { _id: receiverId },
                { lastMessage: newMessage._id },
                { new: true }
            )
            console.log("tin nhan duoc luu vao database", newMessage);
            return newMessage
        }

        // await socket.to(receiverId).emit("getMessage", newMessage);
        // await socket.emit("getMessage", newMessage);
    }


    //Typing message
    static typingMessage = async ({ channelId, fullName, isTyping }, socket) => {
        await ChannelModel.findById(channelId).lean().then(result => {
            if (result) {
                result.members.forEach(member => {
                    emitProfileId({
                        profileId: member.profileId,
                        params: 'isTyping',
                        data: {
                            isTyping,
                            fullName,
                            channelId,
                        }
                    }, socket)
                })
                return
            } else {
                throw new Error('Not exist profile')
            }
        }).catch(error => {
            console.log("error typing:", error);
        })

    }



























}

module.exports = SocketService