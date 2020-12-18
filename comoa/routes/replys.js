var express = require('express');
var router = express.Router();

const isAuthenticated = require('../service/isAuth');
const replyController = require('../controller/replyController');

router.post('/insertReply', isAuthenticated.user, replyController.insertReply);

router.delete('/deleteReply', isAuthenticated.user, replyController.deleteReply);


module.exports = router;