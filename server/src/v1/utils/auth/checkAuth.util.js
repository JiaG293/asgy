require('dotenv').config();
const jwt = require('jsonwebtoken');
const { findById } = require('../../models/user.model');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        const objKey = await findById(key)
        if (!objKey) {
            res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey
        return next()


    } catch (error) {

    }

}


module.exports = {
    apiKey,
}