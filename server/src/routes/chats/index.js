const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const { message } = require('../../controllers/socket.controller');
const { createSingleChat, createChannelChat, findChannel, sendMessage, getListChannels } = require('../../controllers/chat.controller');



//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/send-message').post(catchAsync(sendMessage));
router.route('/channels').get(catchAsync(getListChannels));
router.route('/findChannel').post(catchAsync(findChannel));

router.route('/create-channel-chat').post(catchAsync(createChannelChat));
router.route('/create-single-chat').post(catchAsync(createSingleChat));


module.exports = router;
