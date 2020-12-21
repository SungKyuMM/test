var mail = require('../service/mailService');

module.exports = {
    send: (req, res, next) => {
        let email = req.body.email;
        var dice = getRandomInt(111111, 999999);
        req.session.emailCode = dice;
        mail(email, res, dice);
    },
    
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