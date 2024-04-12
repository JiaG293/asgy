const mongoose = require("mongoose");
const ChannelModel = require("../models/channel.model");
const ProfileModel = require("../models/profile.model");
const { ConflictRequestError, BadRequestError } = require("../utils/responses/error.response");
const { decodeTokens } = require("../auth/authUtils");
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    X_CLIENT_ID: 'x-client-id',
}

const findChannelByUserId = async (userId) => {
    return await ChannelModel.find({ owner: userId }).lean()
}

const getListChannels = async (headers) => {

    const { authorization } = await headers;
    const clientId = await headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);
    //cach cu khong sua doi 
    /* const listChannels = await ProfileModel
        .findOne({ _id: decodeToken.profileId })
        .select('listChannels')
        .populate({
            path: 'listChannels',
            populate: {
                path: 'members.profileId',
                model: 'Profile',
                select: '_id fullName avatar '
            }
        }).lean()

    if (!listChannels) {
        throw new BadRequestError('Profile not existed');
    }
    return listChannels */
    const profileId = decodeToken.profileId;
    const profile = await ProfileModel
        .findOne({ _id: profileId })
        .select('listChannels')
        .populate({
            path: 'listChannels',
            populate: {
                path: 'members.profileId',
                model: 'Profile',
                select: '_id fullName avatar '
            }
        }).lean()
    if (!profile) {
        throw new BadRequestError('Profile not existed');
    }

    for (const channel of profile.listChannels) {
        console.log("name channel neu ton tai: ", channel.name);
        console.log("icon channel neu ton tai: ", channel.icon);
        // kiem tra xem channel neu la 101 va 102 thi doi ten name Channel && NEU TRONG DAY DA CO TRUONG NAME ROI THI SE KHONG DOI TEN NUA
        if ((channel.typeChannel === 101 || channel.typeChannel === 102) && (!channel.name || !channel.icon)) {
            let nameChannel = '';
            let iconChannel = '';
            for (const member of channel.members) {
                if (member.profileId) {
                    if (member.profileId._id.toString() !== profileId) {
                        nameChannel = member.profileId.fullName;
                        iconChannel = member.profileId.avatar;
                        console.log("name channel duoc thay doi la:", nameChannel);
                        console.log("icon channel duoc thay doi la:", iconChannel)
                        break;
                    }
                }
            }
            //Cap nhat lai truong name
            channel.name = nameChannel;
            channel.icon = iconChannel
        }
    }

    return profile.listChannels
}

const getDetailsChannel = async (req) => {

    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);
    const { channelId } = req.body;

    //Check chat co ton tai trong danh sach hay khong 
    const profile = await ProfileModel.findOne({
        _id: decodeToken.profileId,
        listChannels: { $in: channelId }
    }).select('listChannels').lean();
    if (!profile) {
        throw new BadRequestError('Channel not exist in profile');
    }


    const channel = await ChannelModel.findOne({ _id: channelId }).populate({
        path: 'members.profileId',
        select: '_id fullName avatar '
    }).populate({
        path: 'owner',
        select: '_id fullName avatar '
    }).lean()

    if (!channel) {
        throw new BadRequestError('Channel not existed');
    }
    // kiem tra xem channel neu la 101 va 102 thi doi ten name Channel && NEU TRONG DAY DA CO TRUONG NAME ROI THI SE KHONG DOI TEN NUA
    let nameChannel = '';
    if ((channel.typeChannel === 101 || channel.typeChannel === 102) && !channel.name) {
        for (const member of channel.members) {
            if (member.profileId) {
                if (member.profileId._id.toString() !== decodeToken.profileId) {
                    nameChannel = member.profileId.fullName;
                    console.log("name channel duoc thay doi la:", nameChannel);
                    break;
                }
            }
        }
        //Cap nhat lai truong name
        channel.name = nameChannel;
    }


    return channel
}

const checkChannelSingleExists = async ({ members, typeChannel }) => {
    const findChannel = await ChannelModel.find({
        "members": { $size: members.length }, // do dai mang so sanh phai bang mang da cho 
        "members.profileId": { $all: members }, // profileId ban muon tim
        typeChannel: typeChannel,
    }).lean()

    if (findChannel.length != 0) {
        throw new ConflictRequestError("Channel 1-1 is exists")
    }

}

const createSingleChat = async (req) => {
    const { receiverId, typeChannel } = await req.body
    const authorization = await req.headers[HEADER.AUTHORIZATION]
    const cliendId = await req.headers[HEADER.X_CLIENT_ID]
    if (!authorization) {
        throw new BadRequestError('Invalid authorization header')
    }
    const { profileId } = await decodeTokens(cliendId, authorization)
    const members = await [profileId, receiverId]

    //1. kiem tra loai channel de tao
    /*
     100 la public | 101 la public 1-1 | 201 la private 1-1
     200 la private | 102 la public group | 202 la private group
     999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
     */
    if (Number(typeChannel) != 101 && Number(typeChannel) != 102) {
        throw new BadRequestError("Invalid type channel 101 public 1-1 | 102 private 1-1")
    }

    //2. kiem tra channel 1-1 ton tai khi da tao
    await checkChannelSingleExists({ members, typeChannel })

    //3. tao channel khi da du dieu kien
    // console.log(dataMembers);
    const newSingleChannel = await ChannelModel.create(
        {
            members: members.map(member => {
                return {
                    profileId: member,
                    joinedDate: Date.now()
                }
            }), typeChannel
        })

    await newSingleChannel.members.map(async (member) => {
        const filter = { _id: member.profileId }
        const update = {
            $push: { listChannels: { $each: [newSingleChannel._id], $position: 0 } }
        }
        return await ProfileModel.findOneAndUpdate(filter, update, { new: true });
    })
    return newSingleChannel;
}

const createGroupChat = async (req) => {
    const { members, typeChannel, name } = req.body
    const authorization = req.headers[HEADER.AUTHORIZATION]
    const cliendId = req.headers[HEADER.X_CLIENT_ID]
    if (!authorization) {
        throw new BadRequestError('Invalid authorization header')
    }

    const { profileId } = await decodeTokens(cliendId, authorization)

    await members.push(profileId)


    if (members.length > 3) {
        throw new BadRequestError('Members must have at least 3 members')
    }
    //2. kiem tra loai channel de tao
    /*
     100 la public | 101 la public 1-1 | 201 la private 1-1
     200 la private | 102 la public group | 202 la private group
     999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
     */
    if (Number(typeChannel) == 201 && Number(typeChannel) == 202) {
        throw new BadRequestError("Invalid type channel 201 public 1-1 | 202 private 1-1")
    }

    //4. tao channel khi da du dieu kien
    // console.log(dataMembers);
    const datedNow = Date.now()

    const newGroupChat = await ChannelModel.create({
        owner: profileId, name, members: members.map(member => {
            return {
                profileId: member,
                joinedDate: datedNow
            }
        }), typeChannel
    })
    return newGroupChat;


}

module.exports = {
    createSingleChat,
    findChannelByUserId,
    checkChannelSingleExists,
    getListChannels,
    createGroupChat,
    getDetailsChannel,

}