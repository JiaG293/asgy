require('dotenv').config();
const jwt = require('jsonwebtoken');
const catchAsync = require('../middlewares/catchAsync.middleware');

const authentication = catchAsync(async (req, res, next) => {

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

        jwt.verify(accessToken, publicKey, (err, decode) => {
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
}