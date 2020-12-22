const mongodb = require('mongoose'),
    { Schema } = require("mongoose");

// 게시판 스키마
const boardSchema = new mongodb.Schema({    
    title: String,                              // 제목
    content: String,                            // 내용
    type: String,                               // 타입(자유, 코로나 게시판)
    reg_date: Date,                             // 등록일
    writer: {type: Schema.Types, ref: "Users"}  // 작성자
});

module.exports = mongodb.model('Board', boardSchema);