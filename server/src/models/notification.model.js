const mongoose = require('mongoose');

const COLLECTION_NAME = 'Notifications';
const DOCUMENT_NAME = 'Notification';

const notificationSchema = new mongoose.Schema({
    notificationType: {
        type: String,
        enum: ['MESSAGE_SINGLE', 'MESSAGE_GROUP', 'SYSTEM', 'FRIEND', 'ACCOUNT'],
        required: [true, 'Type must be one of MESSAGE | SYSTEM | FRIEND | ACCOUNT'],
    },
    notificationSenderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile',

    },
    notificationReceiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Profile',
    },
    notificationContent: {
        type: String,

    },
    notificationOptions: {
        type: Object,
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false,
    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);