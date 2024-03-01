const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const { getInformationProfile } = require('../../controllers/profile.controller');


//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/personal-information').post(catchAsync(getInformationProfile));



module.exports = router;