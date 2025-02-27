const mongoose = require('mongoose');

const COLLECTION_NAME = 'Channels'
const DOCUMENT_NAME = 'Channel'

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    iconGroup: {
      type: String,
      default: function () {

        if (this.typeChannel === 101 || this.typeChannel === 102) {
          return undefined;
        }
        return "https://i.imgur.com/WCRmPDS.png";
      },
    },

    background: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
    },
    typeChannel: {
      type: Number,
      enum: [999, 998, 101, 102, 201, 202],
      required: [true, 'Channel type must be one of 999 | 998 | 101 | 102 | 201 | 202'],
      /*
      100 la public | 101 la public 1-1 | 201 la private 1-1
      200 la private | 102 la public group | 202 la private group
      999 la cloud luu tru ca nhan | 998 dich vu bot, khach hang, tin nhan tu dong  
      */
    },
    members: [
      {
        profileId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Profile',
        },
        joinedDate: { type: Date },
        isRemoved: { type: Boolean, default: false },
        _id: false,
      }
    ],
    options: {
      isFreeEnter: { type: Boolean },
      isFreeKickMem: { type: Boolean },
      isFreeEdit: { type: Boolean },
    },
    requests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
    inviteCode: [
      {
        createdDate: { type: Date },
        codeLink: { type: String, required: true, }
      }
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isDisbanded: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, channelSchema);

