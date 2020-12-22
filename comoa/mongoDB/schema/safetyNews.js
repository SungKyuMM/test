const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);

// 국가·지역별 최신안전소식(코로나관련) 스키마
const safetyNewsSchema = new mongodb.Schema({
    id: String,         // id 번호 
    country: String,    // 나라
    title: String,      // 제목
    content: String,    // 내용
    create_dt: Date     // 등록일
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('SafetyNews', safetyNewsSchema);