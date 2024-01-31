const ApiKeyModel = require("../models/apiKey.model")


const findById = async (key) => {
    const objKey = await ApiKeyModel.findOne({ key, status: true }).lean()
    return objKey;
}

module.exports = findById;