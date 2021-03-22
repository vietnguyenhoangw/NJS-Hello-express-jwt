const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index');
const authentication = require('../middleware/authentication');

router.route("/").get(authentication.auth, indexController.homeIndex)
router.use('/user', require('./user'));

module.exports = router;