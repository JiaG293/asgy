const mongoose = require('mongoose');

const COLLECTION_NAME = 'Profiles';
const DOCUMENT_NAME = 'Profile';

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: mongoose.Schema.Types.ObjectId,
        ref: 'user'
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
    phoneNumber: {
        type: String,
        required: [true, 'Please enter phone number'],
        minlength: [10, 'Phone number must be of minimum 10 characters'],
        maxlength: [10, 'Phone number must be of maximum 10 characters'],
        unique: [true, 'Phone number already exists']
    },
    boxChatRecent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'conversation',
            maxItems: 30,
        }
    ],
    friend: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'contact',
        }
    ],

},
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, profileSchema);