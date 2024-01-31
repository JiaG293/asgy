const UserModel = require('../models/user.model');
const ProfileModel = require('../models/profile.model');

const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail.util');
const { createTokenPair } = require('../utils/auth/auth.util');
const KeyTokenService = require('../services/keyToken.service');

class AccessService {
    static signUpUser = async ({ email, username, password, fullName, sex, birthday, phoneNumber }) => {
        try {

            //tim kiem user co ton tai trong database khong?
            const user = await UserModel.findOne({
                $or: [{ email }, { username }]
            }).lean(); //using tra ve kieu object thay vi json

            //bat loi truong hop ton tai tra ve ma loi
            if (user) {
                if (user.username === username) {
                    return {
                        code: 401,
                        message: "Username already exists"
                    }
                }
                if (user.email === email) {
                    return {
                        code: 401,
                        message: "Email already exists"
                    }
                }
            }

            //tao user neu khong co loi 
            const newUser = await UserModel.create({
                email,
                username,
                password,
            });


            //bat loi truong hop tao user
            if (newUser) {

                /* 
                    tao ma privateKey va publicKey theo RSA
                    privateKey: luu o server dung de sign jwt
                    publicKey: luc o database cho nguoi su dung, dung de decode jwt
                */
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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

                //tao publicKeyString de luu vao database
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newUser._id,
                    publicKey
                })
                if (!publicKeyString) {
                    return {
                        code: 401,
                        message: "publicKeyString error"
                    }
                }
                console.log("publicKeyString:", publicKeyString);

                //tao publicKeyObject de verify tao token cho user
                const publicKeyObject = crypto.createPublicKey(publicKeyString);
                console.log("publicKeyObject:", publicKeyObject);

                //verify token
                const tokens = await createTokenPair({ userId: newUser._id, email, username }, publicKeyObject, privateKey);
                console.log("Created tokens success:", tokens);

                //tao profile cho user
                const newProfile = await ProfileModel.create({
                    userId: newUser._id,
                    fullName,
                    sex,
                    birthday,
                    phoneNumber,
                })


                //tra ve thong tin tao
                return {
                    code: 201,
                    metadata: {
                        user: newUser,
                        profile: newProfile,
                        tokens,
                    }
                }
            }
        } catch (error) {
            return {
                code: 401,
                message: error.message,
                status: 'error'
            }
        }

    }
}

module.exports = AccessService