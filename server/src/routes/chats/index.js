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
/* router.route('/send-image/:receiverId').post(catchAsync(uploadImageChat.array('image', 30)), catchAsync(sendImage))
router.route('/send-video/:receiverId').post(catchAsync(uploadVideoChat.array('video', 10)), catchAsync(sendVideo))
router.route('/send-document/:receiverId').post(catchAsync(uploadDocumentChat.array('document', 30)), catchAsync(sendDocument)) */
router.route('/send-files/:typeContent/:receiverId').post(uploadMiddleware, catchAsync(sendDocument)) //co cac dinh dang image | video | document

module.exports = router;

