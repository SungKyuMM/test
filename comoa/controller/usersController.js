const userMongo = require('../mongoDB/userMongo');
const replyMongo = require('../mongoDB/replyMongo');
const bcrypt = require('bcrypt');

module.exports = {
    password_change: (req, res, next) => {
        let password = req.body.password;
        password = bcrypt.hashSync(password, 10);

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

    leaveUser: async (req, res, next) => {
        let password = req.body.password;
        let data = {email: req.user.email};
        let userInfo = await userMongo.findOne(data);

        let bool = bcrypt.compareSync(password, userInfo.password);
        if(bool) {
            // 회원 데이터 삭제
            userMongo.deleteUser(data);

            let replyData = {
                "writer.email": req.user.email
            }

            replyMongo.replyDelete(replyData);
            res.redirect('/logout');
        } else {
            res.redirect('/users/mypage');
        }

    }
}