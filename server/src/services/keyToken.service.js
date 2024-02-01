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

            return tokens ? tokens.publicKey : null;

        } catch (error) {
            return error;
        }
    }

}

module.exports = KeyTokenService;