const mongodb = require('mongoose');
const cityStatusSchema = new mongodb.Schema({
    seq: {type: Number, required: true, unique: true},  // 시퀀스 번호
    create_dt: Date,                                    // 등록일
    death_cnt: Number,                                  // 사망자 수
    def_cnt: Number,                                    // 누적 확진자 수
    gubun: String,                                      // 구분
    inc_dec: Number,                                    // 전일대비 증감 수
    isol_clear_cnt: Number,                             // 격리 해제 수
    isoling_cnt: Number,                                // 격리 환자 수
    local_occ_cnt: Number,                              // 국내발병 수
    over_flow_cnt: Number,                              // 해외유입 수
    qur_rate: String                                    // 10만명당 발생률
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('CityStatus', cityStatusSchema);