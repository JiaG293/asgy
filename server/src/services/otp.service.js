const bcrypt = require('bcryptjs')
const OtpModel = require('../models/otp.model')

exports.insertOtp = async ({ otp, email }) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        const saveOtp = await OtpModel.create({
            email,
            otp: hashOtp
        })

        return saveOtp ? true : false;
    } catch (error) {
        console.log("insertOtp service error:", error);
    }
}

exports.validOtp = async ({ otp, hashOtp }) => {
    try {
        const isValid = await bcrypt.compare(otp, hashOtp)
        return isValid
    } catch (error) {
        console.log("valid service error:", error);
    }
}