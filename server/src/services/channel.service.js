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
    const listChannels = await ProfileModel.findOne({ _id: decodeToken.profileId }).select('listChannels').populate('listChannels').lean();
    if (!listChannels) {
        throw new BadRequestError('User not existed');
    }
    return listChannels
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
    const { receiverId, typeChannel, name } = await req.body
    const authorization = await req.headers[HEADER.AUTHORIZATION]
    const xClientId = await req.headers[HEADER.X_CLIENT_ID]
    if (!authorization) {
        throw new BadRequestError('Invalid authorization header')
    }
    const { clientId, userId, profileId } = await decodeTokens(xClientId, authorization)
    const members = await [profileId, receiverId]

    //1. kiem tra loai channel de tao
    /*
     100 la public | 101 la public 1-1 | 201 la private 1-1
     200 la private | 102 la public group | 202 la private group
     999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
     */
    if (Number(typeChannel) != 101 && Number(typeChannel) != 201) {
        throw new BadRequestError("Invalid type channel 101 public 1-1 | 102 private 1-1")
    }

    //2. kiem tra channel 1-1 ton tai khi da tao
    await checkChannelSingleExists({ members, typeChannel })

    //3. tao channel khi da du dieu kien
    // console.log(dataMembers);
    const newSingleChannel = await ChannelModel.create({
        name, members: members.map(member => {
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

const createChannelChat = async (req) => {
    const { members, typeChannel, name } = await req.body
    const authorization = await req.headers[HEADER.AUTHORIZATION]
    const xClientId = await req.headers[HEADER.X_CLIENT_ID]
    if (!authorization) {
        throw new BadRequestError('Invalid authorization header')
    }

    const { clientId, userId, profileId } = await decodeTokens(xClientId, authorization)

    //1. check members trong danh sach tao co trung voi owner khong
    await members.filter((member, index) => {
        if (member == profileId) {
            members.splice(index, 1) // xoa phan tu thu [index] trong mang khi trung 
            console.log("Member duplicate with owner");
        }
    })

    //2. kiem tra loai channel de tao
    /*
     100 la public | 101 la public 1-1 | 201 la private 1-1
     200 la private | 102 la public group | 202 la private group
     999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
     */
    if (Number(typeChannel) != 101 && Number(typeChannel) != 201) {
        throw new BadRequestError("Invalid type channel 101 public 1-1 | 102 private 1-1")
    }

    //3. kiem tra channel 1-1 ton tai khi da tao
    const channelExist = await checkChannelSingleExists({ owner: profileId, members, typeChannel })

    //4. tao channel khi da du dieu kien
    // console.log(dataMembers);

    const newSingleChannel = await ChannelModel.create({
        owner: profileId, name, members: members.map(member => {
            return {
                profileId: member,
                joinedDate: Date.now()
            }
        }), typeChannel
    })
    console.log(a);
    return a;


}

module.exports = {
    createSingleChat,
    findChannelByUserId,
    checkChannelSingleExists,
    getListChannels,
    createChannelChat,

}