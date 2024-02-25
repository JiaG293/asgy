require('dotenv').config();
const jwt = require('jsonwebtoken');
const catchAsync = require('../middlewares/catchAsync.middleware');

const { findTokenByUserId } = require('../services/keyToken.service');
const { UnauthorizeError, BadRequestError } = require('../utils/responses/error.response');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const verifyJWT = async (token, keySecret) => {
    return await jwt.verify(token, keySecret);
}

const authentication = catchAsync(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new UnauthorizeError('Invalid request');
    }

    const keyStore = await findTokenByUserId(userId)
    if (!keyStore) {
        throw new BadRequestError('Not found key store');
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new UnauthorizeError('Invalid Request')
    }

    try {
        const decodeUser = jwt.verify(accessToken, keyStore.privateKey, { algorithms: ['RS256'] })
        //so sanh thong tin access token mang va decode co verify hay khong boi private va public key pair voi nhau
        console.log(userId, "dsd", decodeUser);
        if (userId !== decodeUser._id) {
            throw new UnauthorizeError('Invalid UserId')
        }
        req.keyStore = keyStore;
        return next();
    } catch (error) {
        throw error;
    }

})

const createTokenPair = async (payload, publicKey, privateKey) => {

    try {
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: process.env.JWT_EXPIRE_ACCESS,
        })

        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: process.env.JWT_EXPIRE_REFRESH,
        })

        await jwt.verify(accessToken, publicKey, (err, decode) => {
            err ?
                console.log("error verify:", err) :
                console.log("decode verify:", decode);

        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.log("error createTokenPair:", error);
    }

}


module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    
}