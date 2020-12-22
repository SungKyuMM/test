var express = require('express');
var router = express.Router();

// 메일 컨트롤러
const mailController = require('../controller/mailController');

// 메일 전송
router.post('/send', mailController.send);

// 메일 코드 확인
router.post('/checkCode', mailController.checkCode);

module.exports = router;