const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);

// 성별 나이 코로나 정보 스키마
const ageGenderStatusSchema = new mongodb.Schema({
    seq: {type: Number, required: true, unique: true},  // 시퀀스 번호
    gubun: String,                                      // 구분
    conf_case: Number,                                  // 확진자
    conf_case_rate: Number,                             // 확진률
    critical_rate: Number,                              // 치명률
    death: Number,                                      // 사망자
    death_rate: Number,                                 // 사망률
    create_dt: Date                                     // 등록일
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('AgeGenderStatus', ageGenderStatusSchema);