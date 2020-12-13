var express = require('express');
var passport = require('passport');
var uService = require('../service/userService');
var isAuthenticated = require('../service/isAuth');
var router = express.Router();

// 로그인 페이지
router.get('/login', (req, res, next) => {
  let userEmail = '';
  if(req.cookies['loginEmail'] !== undefined)
    userEmail = req.cookies['loginEmail'];

  res.render('login', { message: req.flash('error'), userEmail: userEmail });
});

// passport 로그인 인증
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true
  }),
  (req, res) => {
    // 로그인 시 이메일 기억 기능 (쿠키)
    if(req.body.rememberEmail == "on") {
      res.cookie('loginEmail', req.body.email);
    } else {
      res.cookie('loginEmail', '');
    }

    res.redirect('/users/login');
  }
)

// 로그아웃 처리
router.post('/logout', (req, res, next) => {
  req.logOut();
  res.redirect('/users/login');
});

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
  res.redirect('/users/login');
});

// 마이페이지 (로그인 해야만 확인 가능)
router.get('/mypage', isAuthenticated.user, (req, res, next) => {
  res.render('mypage');
});

module.exports = router;
