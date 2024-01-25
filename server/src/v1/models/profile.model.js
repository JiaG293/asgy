const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    avatar: {
        type: String,
        require: true,
        default: "https://i.imgur.com/fL8RNta.png"
    },
    info: {
        type: String,
        default: "Không có thông tin được cấp"
    },
    phoneNumber: [
        {
            type: String,
            trim: true,
        }
    ],
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