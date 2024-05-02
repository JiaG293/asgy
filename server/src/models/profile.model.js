const mongoose = require('mongoose');

const COLLECTION_NAME = 'Profiles';
const DOCUMENT_NAME = 'Profile';

const profileSchema = new mongoose.Schema({
    userId: {
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
        required: [true, 'Gender must be one of Nam | Nữ | Bí mật'],
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
    listChannels: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
        }
    ],
    friends: [
        {
            profileIdFriend: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                require: true,
            },
            friendDated: {
                type: Date,
            },
            isBlocked: {
                type: Boolean,
                default: false,
            },
            _id: false,
        }
    ],
    friendsRequest: [
        {
            profileIdRequest: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                required: true,
            },
            requestDated: {
                type: Date,
            },
            _id: false,
        }
    ],
    listBlocked: [
        {
            profileIdBlock: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile',
                require: true,
            },
            blockDated: {
                type: Date
            },
            _id: false,
        }
    ],
    isOnline: {
        type: Boolean,
        default: false,
    }


},
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = mongoose.model(DOCUMENT_NAME, profileSchema);