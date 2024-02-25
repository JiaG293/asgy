const UserModel = require('../models/user.model');
const ProfileModel = require('../models/profile.model');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendEmail } = require('../utils/sendEmail.util');
const { createTokenPair, verifyJWT } = require('../auth/authUtils');
const KeyTokenService = require('../services/keyToken.service');
const { BadRequestError, ConflictRequestError, UnauthorizeError, ForbiddenError } = require('../utils/responses/error.response');
const { getInfoData } = require('../utils/getInfoModel.util');
const { findByUserID, findByEmail, findByUsername } = require('./user.service');
const { findByPhoneNumber } = require('./profile.service');

class AccessService {

    //Handle refresh token service
    static handleRefreshTokenService = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);

        console.log("token moiiiiiiiiiiiiiiiiiiiiiii\n\n ", foundToken);

        //Neu no co bi su dung lai 
        if (foundToken) {
            //decode xem day la _id nao
            const { _id, userID } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log('used', { _id, userID });
            //xoa tat ca token trong keystore
            await KeyTokenService.deleteKeyById(foundToken._id) // xoa keytoken bang _id cua keytoken
            throw new ForbiddenError('Please login again!!!')
        }

        //Neu khong bi su dung lai
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) {
            throw new UnauthorizeError('User not login')
        }

        const { _id, userID } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('not used', { _id, userID });

        const foundUser = await findByUserID({ userID })
        console.log("found user " + JSON.stringify(foundUser));

        if (!foundUser) {
            throw new UnauthorizeError('User not register')
        }

        //tao token moi
        const tokens = await createTokenPair({ _id, userID }, holderToken.publicKey, holderToken.privateKey);

        //cap nhat token moi vao collections keys
        await holderToken.update({
            $set: {
                refreshToken: tokens.refreshToken,
            },
            $addToSet: {
                refreshTokensUsed: refreshToken, // token da duoc su dung de tao ra token moi 
            }
        })

        return {
            user: getInfoData({ fields: ['_id', 'username', 'email',], object: foundUser }),
            tokens
        }


    }

    //Logout service
    static logoutUser = async (keyStore) => {
        const delKey = await KeyTokenService.removeTokenById(keyStore._id);
        return delKey;
    }


    //Login service
    static loginUser = async ({ userID, password, refreshToken = null }) => {
        //find user
        const findUser = await findByUserID({ userID });

        //check user
        if (!findUser) {
            throw new UnauthorizeError("User doesn't exist");
        }

        //check password
        const match = bcrypt.compare(password, findUser.password)
        if (!match) {
            throw new UnauthorizeError("Authentication error")
        }

        /*  const keyStore = await KeyTokenService.findTokenByUserId(findUser._id);
 
         if (!keyStore) {
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
             keyPublic = publicKey
             keyPrivate = privateKey
         } */

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


        //verify token
        const tokens = await createTokenPair({ _id: findUser._id, userID }, publicKey, privateKey);
        console.log("Created tokens success:", tokens);

        //tao publicKeyString de luu vao database
        const publicKeyString = await KeyTokenService.createKeyToken({
            userId: findUser._id,
            refreshToken: tokens.refreshToken,
            publicKey,
            privateKey,
        })

        console.log(publicKeyString);
        if (!publicKeyString) {
            throw new UnauthorizeError("Public key string invalid")
        }
        console.log("publicKeyString:", publicKeyString.publicKey);

        //tao publicKeyObject de verify tao token cho user
        const publicKeyObject = crypto.createPublicKey(publicKeyString.publicKey);
        console.log("publicKeyObject:", publicKeyObject);

        console.log(publicKeyString);
        //tra ve thong tin tao cho body
        return {
            client: publicKeyString._id,
            user: getInfoData({ fields: ['_id', 'username', 'email',], object: findUser }),
            tokens,
        }

    }

    static signUpUser = async ({ email, username, password, fullName, gender, birthday, phoneNumber }) => {
        /* //tim kiem user co ton tai trong database khong?
        const user = await UserModel.findOne({
            $or: [{ email }, { username }]
        }).lean(); //using tra ve kieu object thay vi json
 */
        const checkUsername = await findByUsername({ username });
        const checkEmail = await findByEmail({ email });
        const checkPhoneNumber = await findByPhoneNumber({ phoneNumber })

        //bat loi truong hop ton tai tra ve ma loi
        if (checkUsername?.username === username) {
            throw new ConflictRequestError('Username already exists');
        }
        if (checkEmail?.email === email) {
            throw new ConflictRequestError('Email already exists');
        }
        if (checkPhoneNumber?.phoneNumber === phoneNumber) {
            throw new ConflictRequestError('Phone Number already exists')
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
            gender,
            birthday,
            phoneNumber,
        });

        //Xac thuc du lieu trong model co hop le hay khong
        if (dataUser.validateSync() !== undefined) {
            throw new BadRequestError(dataUser.validateSync())
        }
        if (dataProfile.validateSync() !== undefined) {
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

            //verify token
            const tokens = await createTokenPair({ userId: newUser._id, email, username }, publicKey, privateKey);
            console.log("Created tokens success:", tokens);

            //tao publicKeyString de luu vao database
            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newUser._id,
                refreshToken: tokens.refreshToken,
                publicKey,
                privateKey,
            })
            if (!publicKeyString) {
                throw new UnauthorizeError("Public key string invalid")
            }
            console.log("publicKeyString:", publicKeyString);

            //tao publicKeyObject de verify tao token cho user
            const publicKeyObject = crypto.createPublicKey(publicKeyString.publicKey);
            console.log("publicKeyObject:", publicKeyObject);

            //tra ve thong tin tao cho body
            return {
                client: publicKeyString._id,
                user: getInfoData({ fields: ['_id', 'username', 'email',], object: newUser }),
                profile: getInfoData({ fields: ['_id', 'userId', 'fullName', 'gender', 'birthday', 'phoneNumber'], object: newProfile }),
                tokens,
            }
        }

    }
}

module.exports = AccessService