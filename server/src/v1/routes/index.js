const express = require('express');
const { apiKey } = require('../utils/auth/checkAuth.util');
const router = express.Router();


//check Api key 
router.use(apiKey)


//
router.use('/v1/api/users', require('./access'))



module.exports = router;










