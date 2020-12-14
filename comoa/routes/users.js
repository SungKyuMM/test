var express = require('express');
var uService = require('../service/userService');
var isAuthenticated = require('../service/isAuth');
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

module.exports = router;
