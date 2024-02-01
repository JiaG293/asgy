const UserModel = require("../models/user.model")

const findByUsername = async ({ username, email, select = {
    username: 1,
    email: 1,
    password: 1,
    verify: 1,
    resetPasswordToken: 1,
} }) => {
    return await UserModel.findOne({ $or: [{ email: email }, { username: username }] }).select(select).lean()
}

module.exports = {
    findByUsername,

}