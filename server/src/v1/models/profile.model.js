const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    fullName: {
        type: String,
        required: [true, "Please enter name"],
    },
    avatar: {
        type: String,
        default: "https://i.imgur.com/fL8RNta.png",
    },
    info: {
        type: String,
        default: "Không có thông tin được cấp",
    },
    birthday: {
        type: Date,
    },
    phoneNumber: {
        type: String,
        required: [true, "Please enter phone number"],
        minlength: [10, "Phone number must be of minimum 10 characters"],
        maxlength: [10, "Phone number must be of maximum 10 characters"],
    },
    boxChatRecent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversation",
            maxItems: 30,
        }
    ],
    friend: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "contact",
        }
    ],

});

module.exports = mongoose.model("profile", profileSchema);