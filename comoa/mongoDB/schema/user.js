const mongodb = require('mongoose');

// 회원 정보 스키마
const userSchema = new mongodb.Schema({
    email: {type: String, required: true, unique: true},    // 이메일
    password: String,                                       // 패스워드
    name: String,                                           // 이름
    reg_date: Date,                                         // 가입일
    authority: String,                                      // 권한
    profile: String                                         // 프로필 사진 위치
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('Users', userSchema);