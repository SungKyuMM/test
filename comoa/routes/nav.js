var express = require('express');
var router = express.Router();

const isAuthenticated = require('../service/isAuth');
const navController = require('../controller/navController');

// 네비 수정
router.get('/modify/:_id', isAuthenticated.user, navController.modifynav);
router.put('/modify/:_id', isAuthenticated.user, navController.modifynav);

// 네비 등록
router.get('/register', isAuthenticated.user, navController.registernav);
router.post('/register', isAuthenticated.user, navController.registernav);

// 네비 삭제
router.delete('/delete', isAuthenticated.user, navController.deletenav);

// 타입별 네비 확인(리스트)
router.get('/', isAuthenticated.user, navController.showList);
router.get('/:_id', isAuthenticated.user, navController.shownav);

module.exports = router;