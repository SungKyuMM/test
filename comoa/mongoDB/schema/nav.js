const mongodb = require('mongoose'),
    { Schema } = require("mongoose");
const navSchema = new mongodb.Schema({    
    title: String,              // 사용자가 등록한 위치이름
    latitude: String,           // 위도
    longitude: String,          // 경도
    reg_date: Date,             // 저장 시간
    writer: {type: Schema.Types, ref: "Users"}
});

module.exports = mongodb.model('nav', navSchema);