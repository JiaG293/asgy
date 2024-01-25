const mongoose = require('mongoose');
const { token } = require('morgan');

const usedCookieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  tokens: [
    {
      token: {
        type: String,
      },
      expire: {
        type: Date
      }
    }
  ],
});

module.exports = mongoose.model('usedCookie', usedCookieSchema);