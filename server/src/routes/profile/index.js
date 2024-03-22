const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const { getInformationProfile, updateInformationProfile, getListFriends, sendFriendRequest, acceptFriendRequest } = require('../../controllers/profile.controller');


//Luon luon su dung router duoi authentication
// router.route('/test').get(catchAsync(test))



router.use(authentication)
router.route('/personal-information').post(catchAsync(getInformationProfile));
router.route('/update-info').patch(catchAsync(updateInformationProfile));

//get list friends ban be
router.route('/friends/:profileFriendId').get(catchAsync(getListFriends));
//get list friends auth ban than
router.route('/friends').get(catchAsync(getListFriends));


router.route('/send-request').post(catchAsync(sendFriendRequest));
router.route('/accept-request').post(catchAsync(acceptFriendRequest));


module.exports = router;