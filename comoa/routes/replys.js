var express = require('express');
var router = express.Router();

const isAuthenticated = require('../service/isAuth');               // 로그인 확인
const replyController = require('../controller/replyController');   // 댓글 컨트롤러

// 댓글 리스트
router.post('/listReply', isAuthenticated.user, replyController.listReply);

// 댓글 등록
router.post('/insertReply', isAuthenticated.user, replyController.insertReply);

// 댓글 삭제
router.delete('/deleteReply', isAuthenticated.user, replyController.deleteReply);


module.exports = router;