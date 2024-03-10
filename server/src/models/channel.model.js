const mongoose = require('mongoose');

const COLLECTION_NAME = 'Channels'
const DOCUMENT_NAME = 'Channel'

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "https://i.imgur.com/WCRmPDS.png"
    },
    background: {
      type: String,
      default: "default",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    typeRoom: {
      type: Number,
      enum: [999, 998, 101, 102, 201, 202],
      required: [true, 'Room type must be one of 999 | 998 | 101 | 102 | 201 | 202'],
      /*
      100 la public | 101 la public 1-1 | 201 la private 1-1
      200 la private | 102 la public group | 202 la private group
      999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
      */
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    }
    ],
    isActive: {
      type: Boolean,
      default: "true"
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, channelSchema);

