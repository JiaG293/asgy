const mongoose = require('mongoose');

const COLLECTION_NAME = 'Messages'
const DOCUMENT_NAME = 'Message'

const messageSchema = new mongoose.Schema(
    {
        messageOriginalId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Profile',
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Channel',
        },
        typeContent: {
            type: String,
            enum: ['TEXT_MESSAGE', 'REVOKE_MESSAGE', "REMOVE_MESSAGE", 'FORWARD_MESSAGE', 'LINK_MESSAGE', 'FILE', 'IMAGE_FILE', 'AUDIO_FILE', 'VIDEO_FILE', 'DOCUMENT_FILE', 'EXTENSION'],
            required: [true, 'Room type must be one of TEXT_MESSAGE | REVOKE_MESSAGE | FORWARD_MESSAGE | LINK | FILE | IMAGE_FILE | AUDIO_FILE | VIDEO_FILE | DOCUMENT_FILE | EXTENSION']
        },
        messageContent: {
            type: String,
            required: [true, 'Content not empty']
        },
        isRemoved: {
            type: Boolean,
            default: false,
        },
        isRevoked: {
            type: Boolean,
            default: false,
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, messageSchema);

