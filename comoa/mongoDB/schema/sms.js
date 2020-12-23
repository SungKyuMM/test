const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);
const smsSchema = new mongodb.Schema({
    id: String,
    create_date: String,        // 메시지 생성일시
    location_id: String,        // 수신지역 코드
    location_name: String,      // 수신지역 이름
    md101_sn: String,           // 일련번호
    msg: String,                // 내용
    send_platform: String       // 발신처
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('sms', smsSchema);