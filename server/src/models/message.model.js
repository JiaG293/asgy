const mongoose = require('mongoose');
const { message } = require('../controllers/socket.controller');

const COLLECTION_NAME = 'Messages'
const DOCUMENT_NAME = 'Message'

const messageSchema = new mongoose.Schema(
    {
        fromId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        toId: {
            type: String,
            required: true,
        },
        typeMessage: {
            type: String,
            enum: ['text', 'link', 'file', 'image', 'video', 'audio', 'document', 'extension'],
            required: [true, 'Room type must be one of text | link | file | image | video | audio | document | extension']
        },
        messageContent: {
            messageText: {
                type: String,
            },
            messageLink: {
                type: String,
            },
            messageFile: {
                type: String,
            },
            messageImage: {
                type: String,
            },
            messageAudio: {
                type: String,
            },
            messageDocument: {
                type: String,
            }
        },
        status: {
            type: Boolean,
            default: true
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, messageSchema);

