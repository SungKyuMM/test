var mail = require('../service/mailService');

module.exports = {
    // 메일 전송
    send: (req, res, next) => {
        let email = req.body.email;
        var dice = getRandomInt(100000, 999999);
        req.session.emailCode = dice;
        mail(email, res, dice);
    },
    
    // 메일 코드 확인
    checkCode: (req, res, next) => {
        let code = req.body.code;
        if(req.session.emailCode == code) {
            delete req.session.emailCode;
            res.json({status: "OK"});        
        } else {
            res.json({status: "False"});
        }
    }
}

var getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};