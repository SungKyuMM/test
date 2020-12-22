const userMongo = require('../mongoDB/userMongo');
const replyMongo = require('../mongoDB/replyMongo');
const bcrypt = require('bcrypt');

module.exports = {
    // 패스워드 변경
    password_change: (req, res, next) => {
        let password = req.body.password;
        password = bcrypt.hashSync(password, 10);   // 입력 패스워드 Hash화

        let query = {
            email: req.user.email
        }

        let data = {
            $set: {
                password: password
            }
        }

        userMongo.updateOne(query, data);
        res.redirect('/logout');
    },

    // 회원 탈퇴
    leaveUser: async (req, res, next) => {
        let password = req.body.password;
        let data = {email: req.user.email};
        let userInfo = await userMongo.findOne(data);                   // 이메일을 통한 회원 검색

        let bool = bcrypt.compareSync(password, userInfo.password);     // 회원 패스워드와 입력 패스워드 값 비교
        if(bool) {
            // 회원 데이터 삭제
            userMongo.deleteUser(data);

            let replyData = {
                "writer.email": req.user.email
            }

            replyMongo.replyDelete(replyData);                          // 회원이 작성한 댓글 전체 삭제
            res.redirect('/logout');                                    // 완료 후 로그아웃
        } else {
            res.redirect('/users/mypage');                              // 실패 시 다시 마이페이지로
        }

    }
}