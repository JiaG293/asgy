const ProfileModel = require('../models/profile.model')
const FriendModel = require('../models/friend.model');
const { BadRequestError } = require('../utils/responses/error.response');
const mongoose = require('mongoose');
const { decodeTokens } = require('../auth/authUtils');
const { deleteFileS3 } = require('./s3.service');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    X_CLIENT_ID: 'x-client-id',
}

//find profile all database
const findProfilePublic = async (req) => {
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID];
    const decodeToken = await decodeTokens(clientId, authorization);

    const { stringFind } = req.params;


    const listSearch = await findProfileByRegexString(stringFind);
    /* if (!listSearch) {
        throw new BadRequestError('User for profile not found');
    } */
    return listSearch
}


//LAY THONG TIN PROFILE
const getInformationProfile = async (headers) => {
    const { authorization } = await headers;
    const clientId = await headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    //find profile by _id profile
    const infoProfile = await ProfileModel.findOne({_id: decodeToken.profileId}).select('-createdAt -updatedAt -listChannels')
    if (!infoProfile) {
        throw new BadRequestError('User for profile not found');
    }
    return infoProfile
}

//CAP NHAT THONG TIN PROFILE
const updateInformationProfile = async (req) => {
    const { fullName, gender, info, birthday, phoneNumber } = req.body
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);


    //KHONG DUNG TRANSACTION
    /* const filter = { userId: userId }
    const update = {
        userId, fullName, avatar, gender, info, birthday, phoneNumber
    }
    const options = { upsert: false, new: true }

    const profileUpdate = await ProfileModel.findOneAndUpdate(filter, update, options)

    await FriendModel.updateMany({ profileFriendId: userId },{ $set: { 'profileFriend.$': update } },, options);

    return profileUpdate; */

    //AP DUNG TRANSACTION
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const update = {};
        if (fullName !== undefined) update.fullName = fullName;
        if (req.file.location !== undefined) {
            const user = await findProfileByUserId(decodeToken.userId)
            await deleteFileS3(user.avatar)
            update.avatar = await req.file.location;
        }
        if (gender !== undefined) update.gender = gender;
        if (info !== undefined) update.info = info;
        if (birthday !== undefined) update.birthday = birthday;
        if (phoneNumber !== undefined) update.phoneNumber = phoneNumber;
        console.log("update", update);

        const filter = { userId: decodeToken.userId }

        const options = { upsert: false, new: true }

        // Cap nhat thong tin trong bang profile 
        const profileUpdate = await ProfileModel.findOneAndUpdate(filter, update, options).session(session);

        // Cap nhat cac thong tin nhung trong bang friend
        await FriendModel.updateMany({ profileFriendId: decodeToken.profileId }, { $set: { 'profileFriend.$': update } }, options).session(session);

        await session.commitTransaction();
        session.endSession();

        return profileUpdate;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw new BadRequestError('Error updating profile information');
    }
}


//LAY RA DANH SACH BAN BE PUBLIC
const getListFriendsPublic = async (req) => {
    //Cach cu req.body.
    // return await ProfileModel.findOne({ _id: req.params.profileId }).select('userId friends').populate('friends', '-friends -createdAt -updatedAt -__v').lean()
    const profileFriendId = req.params?.profileFriendId
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    if (profileFriendId) {
        console.log("GET LIST PROFILE FRIEND");
        return await ProfileModel
            .findOne({ _id: profileFriendId })
            .select('friends')
            .populate('friends', '-friends -createdAt -updatedAt -__v')
            .lean()
    }
    else {
        return await ProfileModel
            .findOne({ _id: decodeToken.profileId })
            .select('friends')
            .populate('friends', '-friends -createdAt -updatedAt -__v')
            .lean()
    }

}


//LAY RA DANH SACH BAN BE PRIVATE
const getListFriendsPrivate = async (req) => {
    //Cach cu req.body.
    // return await ProfileModel.findOne({ _id: req.params.profileId }).select('userId friends').populate('friends', '-friends -createdAt -updatedAt -__v').lean()
    const profileFriendId = req.params?.profileFriendId
    const { authorization } = req.headers;
    const clientId = req.headers[HEADER.X_CLIENT_ID]
    const decodeToken = await decodeTokens(clientId, authorization);

    if (profileFriendId) {
        console.log("GET LIST PROFILE FRIEND");
        return await ProfileModel
            .findOne({ _id: profileFriendId })
            .select('friends')
            .populate('friends', '-friends -createdAt -updatedAt -__v')
            .lean()
    }
    else {
        return await ProfileModel
            .findOne({ _id: decodeToken.profileId })
            .select('friends')
            .populate('friends', '-friends -createdAt -updatedAt -__v')
            .lean()
    }

}


const findByPhoneNumber = async ({ phoneNumber }) => {
    return await ProfileModel.findOne({ phoneNumber: phoneNumber }).lean()
}

const findProfileByUserId = async (userId) => {
    return await ProfileModel.findOne({ userId: userId }).lean()
}

const findProfileById = async (profileId) => {
    return await ProfileModel.findOne({ _id: profileId }).lean()
}

const findProfileByRegex = async (stringFind) => {
    if (stringFind?.name) {
        const regexName = new RegExp(stringFind.name, 'i')
        return await ProfileModel.find({ fullName: { $regex: regexName } })
    }
    if (stringFind?.phoneNumber) {
        const regexPhoneNumber = new RegExp(stringFind.phoneNumber, 'i')
        return await ProfileModel.find({ phoneNumber: { $regex: regexPhoneNumber } })
    }

}

const findProfileByRegexString = async (stringFind) => {
    const regexString = new RegExp(stringFind, 'i')
    console.log(regexString);
    return await ProfileModel.aggregate([
        {
            $project: {
                updatedAt: 0,
                createdAt: 0,
                listChannels: 0,
                friends: 0,
            }
        },
        {
            $lookup: {
                from: 'Users',  // tu collection muon join
                localField: 'userId',  // key trong this.collection
                foreignField: '_id',  // key trong collection muon join
                as: 'user_details'  // key ket qua join
            }
        },
        {
            $addFields:
            {
                user_details:
                {
                    $arrayElemAt: ["$user_details", 0]
                }
            }
        },
        {
            $match:
            {
                $or: [
                    { 'user_details.username': { $regex: regexString } },
                    { phoneNumber: { $regex: regexString } }
                ]
            }
        },
        {
            $project: {
                'user_details.password': 0,
                'user_details.email': 0,
                'user_details.updatedAt': 0,
                'user_details.createdAt': 0,
                'user_details._id': 0,
            }
        }
    ])
}



module.exports = {
    findProfileById,
    findByPhoneNumber,
    findProfileByUserId,
    getInformationProfile,
    updateInformationProfile,
    findProfileByRegex,
    getListFriendsPublic,
    getListFriendsPrivate,
    findProfilePublic,
    findProfileByRegexString

}