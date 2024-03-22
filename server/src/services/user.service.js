const { Mongoose, Types } = require("mongoose");
const UserModel = require("../models/user.model")
const { BadRequestError, ConflictRequestError, UnauthorizeError, ForbiddenError } = require('../utils/responses/error.response');
const { findChannelByUserId } = require("./channel.service");
const uuid = require('uuid')
const crypto = require('crypto')


const getResetPasswordToken = async (user) => {

    const resetToken = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiry = Date.now() + 1 * 60 * 1000; //het han sau 1p

    return resetToken;
}


//get infomation user
const getInformationUser = async (user) => {
    const infoUser = await findUserById(user.userId);
    if (!infoUser) {
        throw new ErrorResponse("User not found");
    }
    return infoUser
}


const findByUserID = async ({ userID, select = {
    username: 1,
    email: 1,
    password: 1,
    verify: 1,
    resetPasswordToken: 1,
    resetPasswordExpiry: 1,
} }) => {
    //cu voi email va password
    //return await UserModel.findOne({ $or: [{ username: username }, { email: email }] }).select(select).lean()
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userID)) {
        return await UserModel.findOne({ email: userID }).select(select)
    } else {
        return await UserModel.findOne({ username: userID }).select(select)
    }
}

const findByUsername = async (username) => {
    return await UserModel.findOne({ username: username }).lean()
}

const findByEmail = async (email) => {
    return await UserModel.findOne({ email: email }).lean()
}

const findUserById = async (id) => {
    console.log(id);
    return await UserModel.findOne({ _id: id }).lean()
}






module.exports = {
    getResetPasswordToken,
    findByUserID,
    findByUsername,
    findByEmail,
    findUserById,
    getInformationUser

}