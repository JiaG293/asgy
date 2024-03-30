const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const { getInformationProfile, updateInformationProfile, getListFriendsPrivate, getListFriendsPublic, sendFriendRequest, acceptFriendRequest, findProfilePublic } = require('../../controllers/profile.controller');
const { uploadAvatar } = require('../../services/s3.service')



//PUBLIC
//get list friends ban be
router.route('/friends/:profileFriendId').get(catchAsync(getListFriendsPublic));

router.route('/search/:stringFind').get(catchAsync(findProfilePublic))


//PRIVATE
router.use(authentication)
//get information profile
router.route('/').get(catchAsync(getInformationProfile));



//Update profile information
router.route('/update').put(uploadAvatar.single('avatar'), catchAsync(updateInformationProfile));

//get list friends private auth
router.route('/friends').get(catchAsync(getListFriendsPrivate));

router.route('/send-request').post(catchAsync(sendFriendRequest));
router.route('/accept-request').post(catchAsync(acceptFriendRequest));


module.exports = router;