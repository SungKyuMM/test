var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

router.get('/aa', (req, res, next) => {
    res.render('sample', { title: '11' });
});

// 로그인 페이지
router.get('/login', (req, res, next) => {
    let userEmail = '';
    if (req.cookies['loginEmail'] !== undefined)
        userEmail = req.cookies['loginEmail'];

    res.render('login', { message: req.flash('error'), userEmail: userEmail });
});

// passport 로그인 인증
router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    (req, res) => {
        // 로그인 시 이메일 기억 기능 (쿠키)
        if (req.body.remember == "on") {
            res.cookie('loginEmail', req.body.email);
        } else {
            res.cookie('loginEmail', '');
        }

        res.redirect('/');
    }
)

// 로그아웃 처리
router.post('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;