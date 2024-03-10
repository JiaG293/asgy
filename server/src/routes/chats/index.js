const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const { message } = require('../../controllers/socket.controller');
const { createChanel, findChannel } = require('../../controllers/chat.controller');

const path = require('path')




router.route('/chat').get((req, res, next) => {
    res.sendFile(path.join(__dirname + '\\index.html'))
});

//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/message').post(catchAsync(message));
router.route('/channel').post(catchAsync(createChanel));
router.route('/findChannel').post(catchAsync(findChannel));


module.exports = router;