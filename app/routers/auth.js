const express = require('express'),
    router = express.Router(),
    authControllers = require('../controllers/auth');

router.route('/login')
    .post(authControllers.login);

module.exports = router;