const express = require('express');
const { apiKey } = require('../auth/checkAuthController');
const router = express.Router();


//kiem tra api key phan quyen nguoi dung
// router.use(apiKey)


//khoi tao routes
router.use('/v1/api/users', require('./access'))



module.exports = router;










