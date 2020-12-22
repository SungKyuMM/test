var express = require('express');
var router = express.Router();

const isAuthenticated = require('../service/isAuth');                   // 로그인 인증
const boardsController = require('../controller/boardsController');     // 게시글 컨트롤러


// 게시물 수정
router.get('/modify/:_id', isAuthenticated.user, boardsController.modifyBoard);
router.put('/modify/:_id', isAuthenticated.user, boardsController.modifyBoard);

// 게시물 등록
router.get('/register/:type', isAuthenticated.user, boardsController.registerBoard);
router.post('/register/:type', isAuthenticated.user, boardsController.registerBoard);

// 게시물 삭제
router.delete('/delete/:type', isAuthenticated.user, boardsController.deleteBoard);

// 타입별 게시물 확인(리스트)
router.get('/:type', boardsController.showList);
router.get('/:type/:_id', boardsController.showBoard);

module.exports = router;