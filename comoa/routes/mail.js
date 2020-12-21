var express = require('express');
var router = express.Router();

const mailController = require('../controller/mailController');

router.post('/send', mailController.send);

router.post('/checkCode', mailController.checkCode);

module.exports = router;