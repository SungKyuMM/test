const mongodb = require('mongoose');
const overseaOutbreakSchema = new mongodb.Schema({
    seq: {type: Number, required: true, unique: true},
    area_nm: String,
    create_dt: Date,
    nat_death_cnt: Number,
    nat_death_rate: Number,
    nat_def_cnt: Number,
    nation_nm: String
});

// model에 작성한 문자열이 mongoDB collection이름을 나타냄
module.exports = mongodb.model('OverseaOutbreak', overseaOutbreakSchema);