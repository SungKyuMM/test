var mail = require('../service/mailService');

module.exports = {
    // 메일 전송
    send: (req, res, next) => {
        let email = req.body.email;                 // 전송할 이메일
        var dice = getRandomInt(100000, 999999);    // 메일 코드 난수 저장
        req.session.emailCode = dice;               // session에 난수 저장
        mail(email, res, dice);                     // 메일 전송 서비스
    },
    
    // 메일 코드 확인
    checkCode: (req, res, next) => {
        let code = req.body.code;                   // 메일 코드
        if(req.session.emailCode == code) {         // 코드 일치
            delete req.session.emailCode;           // session에서 난수 삭제
            res.json({status: "OK"});        
        } else {                                    // 코드 불일치
            res.json({status: "False"});
        }
    }
}

// 난수 발생 함수
var getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};