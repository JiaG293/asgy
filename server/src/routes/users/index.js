const express = require('express');
const router = express.Router();
const catchAsync = require('../../middlewares/catchAsync.middleware');
const { authentication } = require('../../auth/authUtils');
const UsersController = require('../../controllers/users.controller');


//Luon luon su dung router duoi authentication
router.use(authentication)
router.route('/information').post(catchAsync(UsersController.getInformationUser));



module.exports = router;