const mongodb = require('mongoose');
mongodb.set('useCreateIndex', true);
const ageGenderStatusSchema = new mongodb.Schema({
    seq: {type: Number, required: true, unique: true},
    gubun: String,
    conf_case: Number,
    conf_case_rate: Number,
    critical_rate: Number,
    death: Number,
    death_rate: Number,
    create_dt: Date
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('AgeGenderStatus', ageGenderStatusSchema);