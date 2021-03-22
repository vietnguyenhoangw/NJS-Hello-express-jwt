const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const authentication = require('../middleware/authentication');

router.route("/").get(authentication.auth, indexController.home)

module.exports = router;