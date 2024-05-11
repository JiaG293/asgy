const mongoose = require('mongoose');

const COLLECTION_NAME = 'Otps';
const DOCUMENT_NAME = 'Otp';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    otp: {
        type: String,
    },
    time: {
        type: Date,
        default: Date.now(),
        index: {
            expires: 10 // bị xóa sau 10p
        }

    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, otpSchema);