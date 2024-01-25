const express = require('express');
const router = express.Router();
const { forgotPassword, signupUser, logoutUser, loginUser, resetPassword, getUserInfo, updatePassword, searchUser } = require('../controllers/user.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.route('/password/forgot').post(forgotPassword);
router.route('/signup').post(signupUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/reset/:token').patch(resetPassword);
router.route('/user/:username').get(isAuthenticated, getUserInfo)
router.route("/password/update").patch(isAuthenticated, updatePassword);
router.route("/search").get(searchUser);



module.exports = router;










