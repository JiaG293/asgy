const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const catchAsync = require('./catchAsync.middleware');

// Middleware để băm mật khẩu trước khi lưu
const hashPassword = catchAsync(async function (req, res, next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

// Middleware để tạo token
const generateToken = catchAsync(function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
})

// Middleware để tạo token reset mật khẩu
const getResetPasswordToken = catchAsync(async function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // het han sau 15p - quy doi milisecond
    return resetToken;
});

// so sanh mat khau 
const comparePassword = catchAsync(async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  });

module.exports = {
    hashPassword,
    generateToken,
    getResetPasswordToken,
    comparePassword
};
