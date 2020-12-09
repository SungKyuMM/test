const mongodb = require('mongoose');
const cityStatusSchema = new mongodb.Schema({
    seq: {type: Number, required: true, unique: true},
    create_dt: Date,
    death_cnt: Number,
    def_cnt: Number,
    gubun: String,
    inc_dec: Number,
    isol_clear_cnt: Number,
    isoling_cnt: Number,
    local_occ_cnt: Number,
    over_flow_cnt: Number,
    qur_rate: String
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('CityStatus', cityStatusSchema);