const ProfileModel = require("../models/profile.model")

const getInformationProfile = async (profile) => {
    const infoProfile = await findProfileByUserId(profile.userId);
    if (!infoProfile) {
        throw new ErrorResponse("User for profile not found");
    }
    return infoProfile
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

}