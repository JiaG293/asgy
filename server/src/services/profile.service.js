const ProfileModel = require("../models/profile.model")

const findByPhoneNumber = async ({ phoneNumber }) => {
    return await ProfileModel.findOne({ phoneNumber: phoneNumber }).lean()
}

module.exports = {
    findByPhoneNumber,

}