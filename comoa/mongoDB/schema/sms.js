const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);
const smsSchema = new mongodb.Schema({
    id: String,
    create_date: String,
    location_id: String,
    location_name: String,
    md101_sn: String,
    msg: String,
    send_platform: String
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('sms', smsSchema);