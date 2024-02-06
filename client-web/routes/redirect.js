const express = require('express');
const redirectControllers = require('../controllers/controller');

const router = express.Router();

router.get('/', redirectControllers.home);
router.get('/login', redirectControllers.login);
router.get('/signup', redirectControllers.signup);
router.get('/logout', redirectControllers.logout);

module.exports = router;
