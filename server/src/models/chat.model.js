const mongoose = require('mongoose');

const COLLECTION_NAME = 'Chats'
const DOCUMENT_NAME = 'Chat'

const chatSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Profile',
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Channel',
            required: true,
        },
        messageId: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Message',
            required: true,
        }

    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, chatSchema);

