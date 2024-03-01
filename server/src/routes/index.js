const express = require('express');
const { apiKey } = require('../auth/checkAuthController');
const router = express.Router();


//kiem tra api key phan quyen nguoi dung
// router.use(apiKey)


//khoi tao routes
router.use('/api/v1/users', require('./access'))

router.use('/api/v1/accounts', require('./users'))

router.use('/api/v1/profile', require('./profile'))



module.exports = router;










