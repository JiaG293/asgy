const { Types } = require("mongoose");
const KeyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //method simple
            /* const publicKeyString = publicKey.toString();
            const tokens = await KeyTokenModel.create({
                userId: userId,
                publicKey: publicKeyString,

            })
            return tokens ? tokens.publicKey : null; */

            //method advanced
            const filter = { userId: userId }
            const update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }
            const options = { upsert: true, new: true }
            const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens : null;

        } catch (error) {
            return error;
        }
    }

    static findTokenByUserId = async (userId) => {
        return await KeyTokenModel.findOne({ userId: Types.ObjectId(userId) }).lean();
    }

    static removeTokenById = async ({ id }) => {
        const result = await KeyTokenModel.deleteOne({
            _id: new Types.ObjectId(id)
        })
        return result;
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await KeyTokenModel.findOne({ refreshTokensUsed: { $elemMatch: { $eq: refreshToken } } }).lean();
    }

    static findByRefreshToken = async (refreshToken) => {
        return await KeyTokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (idKey) => {
        return await KeyTokenModel.findByIdAndDelete({ _id: idKey })
    }

}

module.exports = KeyTokenService;