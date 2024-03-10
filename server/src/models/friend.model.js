const mongoose = require('mongoose');

const COLLECTION_NAME = 'Friends';
const DOCUMENT_NAME = 'Friend';

const friendSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    profileFriend: {
        profileFriendId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        fullName: {
            type: String,
            required: [true, 'Please enter name'],
        },
        avatar: {
            type: String,
            default: 'https://i.imgur.com/fL8RNta.png',
        },
        gender: {
            type: String,
            enum: ['Nam', 'Nữ', 'Bí mật'],
            required: [true, 'Sex must be one of Nam | Nữ | Bí mật'],
        },
        info: {
            type: String,
            default: 'Không có thông tin được cấp',
        },
        birthday: {
            type: Date,
            require: [true, 'Please enter a valid date'],
        },
    },
    status: {
        type: String,
        enum: ['Bạn bè', 'Người lạ', 'Đang chờ chấp nhận'],
        required: [true, 'Status must be one of Bạn bè | Người lạ | Đang chờ chấp nhận'],
    }


},
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, friendSchema);