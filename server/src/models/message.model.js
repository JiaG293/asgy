const mongoose = require('mongoose');
const { message } = require('../controllers/socket.controller');

const COLLECTION_NAME = 'Messages'
const DOCUMENT_NAME = 'Message'

const messageSchema = new mongoose.Schema(
    {
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
            enum: ['text', 'link', 'file', 'image', 'video', 'audio', 'document', 'extension'],
            required: [true, 'Room type must be one of text | link | file | image | video | audio | document | extension']
        },
        messageContent: {
            type: String,
            required: [true, 'Content not empty']
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, messageSchema);

