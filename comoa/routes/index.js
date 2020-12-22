var express = require('express');
var passport = require('passport');
var router = express.Router();
const infectionController = require('../controller/infectionStatusController2');



// 기본 인덱스 페이지
router.get('/', infectionController.infectionGraph);

router.get('/aa', (req, res, next) => {
    res.render('sample', { title: '11' });
});

// 로그인 페이지
router.get('/login', (req, res, next) => {
    let userEmail = '';
    if (req.cookies['loginEmail'] !== undefined)        // 쿠키에 저장된 이메일 확인
        userEmail = req.cookies['loginEmail'];          // 있다면 변수 저장 후 페이지 전달

    res.render('login', { message: req.flash('error'), userEmail: userEmail });
});

// passport 로그인 인증
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',                      // 로그인 실패시 url
        failureFlash: true
    }),
    (req, res) => {
        // 로그인 시 이메일 기억 기능 (쿠키)
        if (req.body.remember == "on") {                // 기억하기 버튼 체크 확인
            res.cookie('loginEmail', req.body.email);   // 쿠키에 이메일 등록
        } else {
            res.cookie('loginEmail', '');               // 체크가 안되어 있으면 쿠키 삭제
        }

        res.redirect('/');                              // 로그인 성공 후 url
    }
)

// 로그아웃 처리
router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
});


module.exports = router;