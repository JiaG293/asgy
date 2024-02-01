const UserModel = require('../models/user.model');
const ProfileModel = require('../models/profile.model');

const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail.util');
const { createTokenPair } = require('../auth/authUtils');
const KeyTokenService = require('../services/keyToken.service');
const { BadRequestError, ConflictRequestError, UnauthorizeError } = require('../utils/responses/error.response');
const { getInfoData } = require('../utils/getInfoModel.util');

class AccessService {
    static signUpUser = async ({ email, username, password, fullName, sex, birthday, phoneNumber }) => {
        //tim kiem user co ton tai trong database khong?
        const user = await UserModel.findOne({
            $or: [{ email }, { username }]
        }).lean(); //using tra ve kieu object thay vi json


        //bat loi truong hop ton tai tra ve ma loi
        if (user) {
            if (user.username === username) {
                throw new ConflictRequestError("Username already exists")
            }
            if (user.email === email) {
                throw new ConflictRequestError("Email already exists")
            }
        }

        //Khoi tao model cho USER va PROFILE
        const dataUser = await new UserModel({
            email,
            username,
            password,
        });
        const dataProfile = await new ProfileModel({
            userId: dataUser._id,
            fullName,
            sex,
            birthday,
            phoneNumber,
        });

        //Xac thuc du lieu trong model co hop le hay khong
        if (dataUser.validateSync() != undefined) {
            throw new BadRequestError(dataUser.validateSync())
        }
        if (dataProfile.validateSync() != undefined) {
            throw new BadRequestError(dataProfile.validateSync())
        }


        //Luu model len database
        const newUser = await dataUser.save();
        const newProfile = await dataProfile.save();

        //Kiem tra USER xem tao co thanh cong hay khong
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
                throw new UnauthorizeError("Public key string invalid")
            }
            console.log("publicKeyString:", publicKeyString);

            //tao publicKeyObject de verify tao token cho user
            const publicKeyObject = crypto.createPublicKey(publicKeyString);
            console.log("publicKeyObject:", publicKeyObject);

            //verify token
            const tokens = await createTokenPair({ userId: newUser._id, email, username }, publicKeyObject, privateKey);
            console.log("Created tokens success:", tokens);


            //tra ve thong tin tao cho body
            return {
                code: 201,
                metadata: {
                    user: getInfoData({ fields: ['_id', 'username', 'email',], object: newUser }),
                    profile: getInfoData({ fields: ['_id', 'userId', 'fullName', 'sex', 'birthday', 'phoneNumber'], object: newProfile }),
                    tokens,
                }
            }
        }

    }
}

module.exports = AccessService