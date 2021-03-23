const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index');
const authentication = require('../middleware/authentication');

router.route("/").get(authentication.auth, indexController.homeIndex);
router.use('/auth', require('./auth'));
router.use('/user', authentication.auth, require('./user'));

module.exports = router;