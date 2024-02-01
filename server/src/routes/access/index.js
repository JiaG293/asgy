const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');

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

router.route('/signup').post(catchAsync(accessController.signupUser));

module.exports = router;