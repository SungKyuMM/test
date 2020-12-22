// service/passport.js - 로그인 기능
const passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');
// const User = require('../mongoDB/schema/user');
const user = require('../mongoDB/userMongo');

// Local 전략 세움
module.exports = () => {
    // 로그인 성공 시 호출
    // stategy 성공 시 호출
    passport.serializeUser((user, done) => {
        // user가 desertializeUser의 첫 번째 매개변수로 이동
        done(null, user);
    });

    // 로그인 성공 후 페이지 마다 정보 호출
    // 매개변수 user는 serializeUser의 done인자 user를 받은 것
    passport.deserializeUser((user, done) => {
        // 여기의 user가 req.user가 됨
        done(null, user);
    });

    // 로그인 인증
    passport.use(new LocalStrategy({
        usernameField: 'email',         // 이메일 property 설정
        passwordField: 'password',      // 패스워드 property 설정
        session: true,
        passReqToCallback: false,
    }, async (email, password, done) => {
        let data = {email: email};
        let userInfo = await user.findOne(data);

        if(userInfo) {
            // Hash 암호화 패스워드 비교
            let bool = bcrypt.compareSync(password, userInfo.password);
            if(bool) {                  // 로그인 성공
                return done(null, userInfo);
            } else {                    // 패스워드 에러
                console.log('패스워드가 틀렸습니다.');
                return done(null, false, {message: '아이디 또는 패스워드를 확인해 주세요.'});
            }
        } else {                        // 등록 되지 않은 사용자
            console.log('없는 사용자 입니다.');
            return done(null, false, {message: '아이디 또는 패스워드를 확인해 주세요.'});            
        }
    }));    
}

