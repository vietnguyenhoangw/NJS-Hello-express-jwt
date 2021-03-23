const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/auth');

router.route('/login').post(authControllers.login);
router.route('/register').post(authControllers.register);
router.route('/token').post(authControllers.token);

module.exports = router;