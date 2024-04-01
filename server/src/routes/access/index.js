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


//PUBLIC
//test data
router.route('/reset-password/:token').post(catchAsync(AccessController.resetPassword)) //Lay token tu email link email
router.route('/forgot-password').post(catchAsync(AccessController.forgotPassword)) //Nhan vao id nguoi dung (email sdt)

router.route('/signup').post(catchAsync(AccessController.signupUser));
router.route('/login').post(catchAsync(AccessController.loginUser));

router.route('/check').get(catchAsync(AccessController.checkPromptSignUp))


//PRIVATE
//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/logout').post(catchAsync(AccessController.logoutUser));
router.route('/handleRefreshToken').post(catchAsync(AccessController.handleRefreshToken));
router.route('/details').get(catchAsync(AccessController.getInformationDetails))



module.exports = router;