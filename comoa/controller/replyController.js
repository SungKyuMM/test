const { SchemaTypes } = require('mongoose');
const replyMongo = require('../mongoDB/replyMongo');
const mongoose = require("mongoose");

module.exports = {
    // 해당 게시글 댓글 리스트
    listReply: async (req, res, next) => {
        let body = req.body;
        // 게시글 _id로 댓글 출력
        let replies = await replyMongo.replyList({board_id: mongoose.Types.ObjectId(body.id)});

        res.json({replies: replies});
    },

    // 댓글 등록
    insertReply: async (req, res, next) => {
        let body = req.body;
        let data = {                    // 댓글 내용
            content: body.content,
            board_id: body.id,
            reg_date: new Date,
            writer: {                   // 댓글 작성자 정보
                email: body.email,
                name: body.name,
                profile: body.profile
            }
        }
        
        let result = await replyMongo.replyInsert(data);

        if(result == 'ok') res.json({status: 'OK'});
        else res.json({status: 'NO'});        
    },

    // 댓글 삭제
    deleteReply: async (req, res, next) => {
        let body = req.body;
        let data = {
            _id: mongoose.Types.ObjectId(body.reply_id)
        }

        // 댓글 _id를 이용한 delete
        replyMongo.replyDelete(data);

        res.json({status: 'OK'}); 
    }
}