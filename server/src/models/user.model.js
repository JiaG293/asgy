const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const COLLECTION_NAME = 'Users';
const DOCUMENT_NAME = 'User';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please enter email'],
            unique: [true, 'Email already exists'],
            lowercase: true,
            trim: true,
            validate: {
                validator: function (mail) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(mail);
                },
                message: props => `${props.value} is not a valid email address!`
            },
        },
        username: {
            type: String,
            required: [true, 'Please enter username'],
            minlength: [6, 'Username must be of minimum 6 characters'],
            unique: [true, 'Username already exists'],
        },
        password: {
            type: String,
            required: [true, 'Please enter password'],
            minlength: [8, 'Password must be of minimum 8 characters'],
            select: false, // an di khi truy van du lieu
        },
        verify: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpiry: Date,
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'profile',
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

userSchema.methods.getResetPasswordToken = async function () {

    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpiry = Date.now() + 1 * 60 * 1000; //het han sau 1p

    return resetToken;
}

module.exports = mongoose.model(DOCUMENT_NAME, userSchema);

