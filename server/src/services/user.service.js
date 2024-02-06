const UserModel = require("../models/user.model")

const findByUsername = async ({ userID, select = {
    username: 1,
    email: 1,
    password: 1,
    verify: 1,
    resetPasswordToken: 1,
} }) => {
    //cu voi email va password
    //return await UserModel.findOne({ $or: [{ username: username }, { email: email }] }).select(select).lean()
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userID)) {
        return await UserModel.findOne({ email: userID }).select(select).lean()
    } else {
        return await UserModel.findOne({ username: userID }).select(select).lean()
    }
}

module.exports = {
    findByUsername,

}