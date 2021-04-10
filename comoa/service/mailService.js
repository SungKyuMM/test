var mailer = require('nodemailer');

// 메일 전송 서비스
module.exports = async (email, res, dice) => {
    
    let transport = mailer.createTransport({    // 메일 발신인 정보
        service: 'gmail',                       // 이용 메일
        auth: {
            user: '이메일',         // 발신인 이메일
            pass: '패스워드'              // 발신인 패스워드
        }
    });

    let mailOptions = {                         // 메일 내용 정보
        from: 'jongsoo996@gmail.com',           // 발신인 이메일
        to: email,                              // 수신인 이메일
        subject: 'Comoa 회원 인증 이메일 입니다.',// 메일 제목
        text: `귀하의 인증번호는 ${dice} 입니다. \n받으신 인증번호를 입력하시면 다음으로 넘어갑니다.` // 메일 내용
    }

    // 메일 전송 기능
    transport.sendMail(mailOptions, (err, info) => {
        if(err) console.log(err);
        else {
            console.log('send success!! ' + info.response);            
            res.json({status: "OK"});
        }
    });
    
};
