const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const { createSingleChat, createGroupChat, findChannel, sendMessage, getListChannels, getDetailsChannel, sendImage, sendVideo, sendDocument, sendFiles } = require('../../controllers/chat.controller');
const { uploadImageChat, uploadVideoChat, uploadDocumentChat, uploadS3 } = require('../../services/s3.service');
const { uploadMiddleware } = require('../../middlewares/chat.middlware');



//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/send-message').post(catchAsync(sendMessage));
router.route('/channels').get(catchAsync(getListChannels));
router.route('/details-channel').get(catchAsync(getDetailsChannel));
router.route('/findChannel').post(catchAsync(findChannel));

router.route('/create-group-chat').post(catchAsync(createGroupChat));
router.route('/create-single-chat').post(catchAsync(createSingleChat));
router.route('/send-files/:typeContent/:receiverId').post(uploadMiddleware, catchAsync(sendFiles)) //co cac dinh dang image | video | document

module.exports = router;

