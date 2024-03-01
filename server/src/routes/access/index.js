const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');

/* const { forgotPassword, signupUser, logoutUser, loginUser, resetPassword, getUserInfo, updatePassword, searchUser } = require('../../controllers/user.controller');
const { isAuthenticated } = require('../../middlewares/auth.middleware'); */

/* router.route('/password/forgot').post(forgotPassword);
router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/reset/:token').patch(resetPassword);
router.route('/user/:username').get(isAuthenticated, getUserInfo)
router.route("/password/update").patch(isAuthenticated, updatePassword);
router.route("/search").get(searchUser); */

//test data
router.route('/test').post(catchAsync(AccessController.test))

router.route('/signup').post(catchAsync(AccessController.signupUser));
router.route('/login').post(catchAsync(AccessController.loginUser));


//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/logout').post(catchAsync(AccessController.logoutUser));
router.route('/handleRefreshToken').post(catchAsync(AccessController.handleRefreshToken));



module.exports = router;