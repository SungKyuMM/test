const mongodb = require('mongoose'),
    { Schema } = require("mongoose");

// 댓글 스키마
const replySchema = new mongodb.Schema({        
    content: String,                                        // 댓글 내용
    board_id: {type: Schema.Types.ObjectId, ref: "Board"},  // 게시글 _id
    reg_date: Date,                                         // 등록일
    writer: {type: Schema.Types, ref: "Users"}              // 작성자 정보
});

module.exports = mongodb.model('reply', replySchema);