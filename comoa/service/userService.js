const bcrypt = require('bcrypt');
const userMongo = require('../mongoDB/userMongo');

var users = {};

users.registerUser = (data) => {
    data.password = bcrypt.hashSync(data.password, 10); // Hash 암호화

    userMongo.insertMany(data);                         // 회원 저장
};  

module.exports = users;