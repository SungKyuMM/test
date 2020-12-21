var express = require('express');
var uService = require('../service/userService');
var isAuthenticated = require('../service/isAuth');
const usersController = require('../controller/usersController');
var router = express.Router();

// 회원가입 페이지
router.get('/register', (req, res, next) => {
  res.render('register');
});

// 회원저장
router.post('/register', (req, res, next) => {
  let body = req.body;
  let data = {
    name: body.name,
    email: body.email,
    password: body.password,
    reg_date: new Date(),
    authority: 'USER'
  }

  uService.registerUser(data);
  res.redirect('/login');
});

// 마이페이지 (로그인 해야만 확인 가능)
router.get('/mypage', isAuthenticated.user, (req, res, next) => {
  res.render('mypage');
});

// 이메일 코드 전송 및 확인 페이지
router.get('/password-email', isAuthenticated.user, (req, res, next) => {
  res.render('password-email');
});

// 패스워드를 잊었을 때 이메일 코드 전송 및 확인 페이지
router.get('/password-forgot', (req, res, next) => {
  res.render('password-forgot');
});

// 패스워드 변경 페이지
router.post('/password-reset', (req, res, next) => {  
  res.render('password-reset');
});

// 패스워드 변경
router.put('/password-change', usersController.password_change);

// 회원 탈퇴 페이지
router.get('/leaveUser', isAuthenticated.user, (req, res, next) => {  
  res.render('leaveUser');
});

// 회원 탈퇴
router.post('/leaveUser', isAuthenticated.user, usersController.leaveUser);

module.exports = router;
