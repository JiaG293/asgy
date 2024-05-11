const bcrypt = require('bcryptjs')
const ValidAccountModel = require('../models/validAccount.model')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

exports.createTokenValidAccount = async ({ email }) => {
    try {
        const token = jwt.sign({ email, isVerify: true }, process.env.JWT_SECRET, {
            expiresIn: "15m" // het han sau 15 phut - neu doi o day nho vao model validAccount doi lai thanh 15p luon
        });
        const saveValidAccount = await ValidAccountModel.create({
            email,
            token,
        })


        return saveValidAccount ? saveValidAccount.token : null
    } catch (error) {
        console.log("createTokenValidAccount service error:", error);
    }
}

exports.verifyTokenValidAccount = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const isExpired = decoded.exp < Date.now() / 1000;
        if (!isExpired) {
           await ValidAccountModel.deleteMany({ email: decoded.email })
        }
        return true
    } catch (error) {
        console.log("verifyTokenValidAccount service error:", error);
        return false
    }
}
