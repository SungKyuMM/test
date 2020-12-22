const mongodb = require('mongoose');

// 코로나19 해외발생 현황 스키마
const overseaOutbreakSchema = new mongodb.Schema({
    seq: {type: Number, required: true, unique: true},  // 시퀀스 번호
    area_nm: String,                                    // 지역명
    create_dt: Date,                                    // 등록일
    nat_death_cnt: Number,                              // 사망자 수
    nat_death_rate: Number,                             // 사망률
    nat_def_cnt: Number,                                // 확진자 수
    nation_nm: String                                   // 나라명
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('OverseaOutbreak', overseaOutbreakSchema);