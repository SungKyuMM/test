const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);
const infectionStatusSchema = new mongodb.Schema({
    seq: Number,
    acc_def_rate: Number,
    acc_exam_cnt: Number,
    acc_exam_comp_cnt: Number,
    care_cnt: Number,
    clear_cnt: Number,
    create_dt: Date,
    death_cnt: Number,
    decide_cnt: Number,
    exam_cnt: Number,
    result_neg_cnt: Number
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('infectionStatus', infectionStatusSchema);