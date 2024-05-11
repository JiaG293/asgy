const mongoose = require('mongoose');

const COLLECTION_NAME = 'ValidAccounts';
const DOCUMENT_NAME = 'ValidAccount';

const validAccountSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now(),
        index: {
            expires: 60 * 15 // Bị xóa sau 15p
        }

    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, validAccountSchema);