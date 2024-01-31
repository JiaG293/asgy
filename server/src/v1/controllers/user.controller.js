const UserModel = require('../models/user.model');
const ProfileModel = require('../models/profile.model');

const catchAsync = require('../middlewares/catchAsync.middleware');
const sendCookie = require('../utils/sendCookie.util');
const ErrorHandler = require('../utils/errorHandler.util');
const { sendEmail } = require('../utils/sendEmail.util');
const crypto = require('crypto');
const { createTokenPair } = require('../utils/auth.util');
const KeyTokenService = require('../services/keyToken.service');


// Signup User
const signupUser = catchAsync(async (req, res, next) => {

    const { email, username, password, fullName, sex, birthday, phoneNumber } = req.body;

    const user = await UserModel.findOne({
        $or: [{ email }, { username }]
    }).lean();

    // const checkPhoneNumber = await Profile.exists({phoneNumber})


    if (user) {
        if (user.username === username) {
            return next(new ErrorHandler("Username already exists", 401));
        }
        if (user.email === email) {
            return next(new ErrorHandler("Email already exists", 401));
        }
    }

    const newUser = await UserModel.create({
        email,
        username,
        password,
    });

    if (newUser) {
        const { privatekey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            }
        })

        const publicKeyString = await KeyTokenService.createKeyToken({
            userId: newUser._id,
            publicKey
        })

        if (!publicKeyString) {
            return next(new ErrorHandler("PublicKeyString error!!", 401))
        }

        console.log("publicKeyString:", publicKeyString);

        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log("publicKeyObject:", publicKeyObject);

        const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey, privatekey);
        console.log("Created tokens sucess:", tokens);

        const newProfile = await ProfileModel.create({
            userId: newUser._id,
            fullName,
            sex,
            birthday,
            phoneNumber,
        })
        sendCookie({ newUser, tokens }, 201, res);
    }




    /* sendCookie(newUser, 201, res); */
});


// check existing phone number

// Get Code Verify Email
const getCodeVerifyEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;

})

// Verification code from client
const CodeVerifyEmail = catchAsync(async (req, res, next) => {

})

// Login User
const loginUser = catchAsync(async (req, res, next) => {

    const { userId, password } = req.body;

    const user = await UserModel.findOne({
        $or: [{ email: userId }, { username: userId }]
    }).select("+password");

    if (!user) {
        return next(new ErrorHandler("User doesn't exist", 401));
    }

    const isPasswordMatched = await UserModel.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Password doesn't match", 401));
    }

    sendCookie(user, 201, res);
});

// Logout User
const logoutUser = catchAsync(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});

// get info user
const getUserInfo = catchAsync(async (req, res, next) => {
    const user = await UserModel.findOne({ username: req.params.username }).select('+password')
    res.status(200).json({
        success: true,
        user
    });
});

// Update Password
const updatePassword = catchAsync(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user._id).select("+password");

    const isPasswordMatched = await UserModel.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Old Password", 401));
    }

    user.password = newPassword;
    await user.save();
    sendCookie(user, 201, res);
});

// Forgot Password
const forgotPassword = catchAsync(async (req, res, next) => {

    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404));
    }

    const resetPasswordToken = await UserModel.getResetPasswordToken()

    await UserModel.save();

    const resetPasswordUrl = `http://${req.get("host")}/password/reset/${resetPasswordToken}`;

    try {
        const checkSending = await sendEmail({
            email: user.email,
            subject: 'RESET PASSWORD',
            content: resetPasswordUrl
        });
        if (checkSending.success) {
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`,
            })
        }


    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
const resetPassword = catchAsync(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpiry: { $gt: Date.now() }
    });



    if (!user) {
        return next(new ErrorHandler("User Not Found Or Token Expire", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendCookie(user, 200, res);
});

// User Search
const searchUser = catchAsync(async (req, res, next) => {

    if (req.query.keyword && req.query?.keyword) {
        const users = await UserModel.find({
            $or: [
                {
                    name: {
                        $regex: req.query.keyword,
                        $options: "i",
                    },
                },
                {
                    username: {
                        $regex: req.query.keyword,
                        $options: "i",
                    }
                }
            ]
        });

        res.status(200).json({
            success: true,
            users,
        });
    }
});


const searchContactUser = catchAsync(async (req, res, next) => {
    if (req.query.keyword && req.query?.keyword) {
        const users = await UserModel.find({
            $or: [
                {
                    name: {
                        $regex: req.query.keyword,
                        $options: "i",
                    },
                },
                {
                    username: {
                        $regex: req.query.keyword,
                        $options: "i",
                    }
                }
            ]
        });

        res.status(200).json({
            success: true,
            users,
        });
    }
});

module.exports = { signupUser, loginUser, logoutUser, updatePassword, getUserInfo, forgotPassword, resetPassword, searchUser }