const mongodb = require('mongoose');
const chatSchema = new mongodb.Schema({
    name: String,
    msg: String,
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('chat', chatSchema);