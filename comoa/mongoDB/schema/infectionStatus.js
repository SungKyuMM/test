const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);

// 코로나19 감염 현황 스키마
const infectionStatusSchema = new mongodb.Schema({
    seq: Number,                    // 시퀀스 번호
    acc_def_rate: Number,           // 누적 확진율
    acc_exam_cnt: Number,           // 검사 수
    acc_exam_comp_cnt: Number,      // 검사완료 수
    care_cnt: Number,               // 치료 중 환자 수
    clear_cnt: Number,              // 격리 해제 수
    create_dt: Date,                // 등록일
    death_cnt: Number,              // 사망자 수
    decide_cnt: Number,             // 확진자 수
    exam_cnt: Number,               // 검사 진행 수
    result_neg_cnt: Number          // 결과 음성 수
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('infectionStatus', infectionStatusSchema);