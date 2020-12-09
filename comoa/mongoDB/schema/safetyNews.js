const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);
const safetyNewsSchema = new mongodb.Schema({
    id: String,
    country: String,
    title: String,
    content: String,
    create_dt: Date
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('SafetyNews', safetyNewsSchema);