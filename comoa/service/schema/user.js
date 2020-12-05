const mongodb = require('mongoose');
const userSchema = new mongodb.Schema({
    email: String,
    password: String,
    name: String,
    nickName: String,
    reg_date: Date,
    authority: String
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('Users', userSchema);