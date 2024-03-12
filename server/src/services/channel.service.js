const mongoose = require("mongoose");
const ChannelModel = require("../models/channel.model");
const { ConflictRequestError } = require("../utils/responses/error.response");


const findChannelByUserId = async (userId) => {
    console.log(userId);
    return await ChannelModel.find({ owner: userId }).lean()
}

const checkChannelExists = async ({ owner, members, typeRoom }) => {
    try {
        const channel = await ChannelModel.find({
            owner: owner,
            members: { $all: members }, //{ $elemMatch: { $eq: members } }
            typeRoom: typeRoom
        }).lean()
        console.log(channel.length);

        // neu ton tai tra ve true neu khong tra ve false
        if (typeRoom == 101 || typeRoom == 201 && channel.length != 0) {
            return true;
        } else if (typeRoom == 102 || typeRoom == 202) {
            return false;
        }
    } catch (error) {
        console.error(error);
    }
}

const createPublicChannel = async ({ userId, name, members }) => {

    //1. check members trong danh sach tao co trung voi owner khong
    await members.filter((member, index) => {
        if (member == userId) {
            members.splice(index, 1) // xoa phan tu thu [index] trong mang khi trung 
            console.log("Member duplicate with owner");
        }
    })

    //2. kiem tra so luong members de phan loai channel
    /*
     100 la public | 101 la public 1-1 | 201 la private 1-1
     200 la private | 102 la public group | 202 la private group
     999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
     */
    let typeRoom = 101;
    if (members.length > 1) {
        typeRoom = 102;
    }

    //3. kiem tra channel 1-1 ton tai khi da tao
    const channelExist = await checkChannelExists({ owner: userId, members, typeRoom })
    if (channelExist) {
        throw new ConflictRequestError("Channel 1-1 is exists")
    }


    //4. tao channel khi da du dieu kien
    return await ChannelModel.create({ owner: userId, name, members: [...members, userId], typeRoom })
}

module.exports = {
    createPublicChannel,
    findChannelByUserId,
    checkChannelExists,

}