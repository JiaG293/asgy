const mongoose = require('mongoose');

const COLLECTION_NAME = 'ApiKeys'
const DOCUMENT_NAME = 'ApiKey'

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [string],
      required: true,
      enum: ['0000', '1111', '2222']
    }
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);

