const KeyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString();
            const tokens = await KeyTokenModel.create({
                userId: userId,
                publicKey: publicKeyString,

            })
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    }
    
}

module.exports = KeyTokenService;