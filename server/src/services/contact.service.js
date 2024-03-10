const ProfileModel = require('../models/profile.model')
const FriendModel = require('../models/friend.model');
const { BadRequestError } = require('../utils/responses/error.response');
const mongoose = require('mongoose');

const getInformationProfile = async (profile) => {
    const infoProfile = await findProfileByUserId(profile.userId);
    if (!infoProfile) {
        throw new ErrorResponse('User for profile not found');
    }
    return infoProfile
}

const updateInformationProfile = async ({ userId, fullName, avatar, gender, info, birthday, phoneNumber }) => {

    //KHONG DUNG TRANSACTION
    /* const filter = { userId: userId }
    const update = {
        userId, fullName, avatar, gender, info, birthday, phoneNumber
    }
    const options = { upsert: false, new: true }

    const profileUpdate = await ProfileModel.findOneAndUpdate(filter, update, options)

    await FriendModel.updateMany({ profileFriendId: userId }, update, options);

    return profileUpdate; */

    //AP DUNG TRANSACTION
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const filter = { userId: userId }
        const update = {
            userId, fullName, avatar, gender, info, birthday, phoneNumber
        }
        const options = { upsert: false, new: true }

        // Cap nhat thong tin trong bang profile 
        const profileUpdate = await ProfileModel.findOneAndUpdate(filter, update, options).session(session);

        // Cap nhat cac thong tin nhung trong bang friend
        await FriendModel.updateMany({ profileFriendId: userId }, update, options).session(session);

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

const findByPhoneNumber = async ({ phoneNumber }) => {
    return await ProfileModel.findOne({ phoneNumber: phoneNumber }).lean()
}

const findProfileByUserId = async (userId) => {
    return await ProfileModel.findOne({ userId: userId }).lean()
}

module.exports = {
    findByPhoneNumber,
    findProfileByUserId,
    getInformationProfile,
    updateInformationProfile,
}