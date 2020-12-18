const { SchemaTypes } = require('mongoose');
const replyMongo = require('../mongoDB/replyMongo');
const mongoose = require("mongoose");

module.exports = {
    listReply: async (req, res, next) => {
        let body = req.body;
        let replies = await replyMongo.replyList({board_id: mongoose.Types.ObjectId(body.id)});

        res.json({replies: replies});
    },

    insertReply: async (req, res, next) => {
        let body = req.body;
        let data = {
            content: body.content,
            board_id: body.id,
            reg_date: new Date,
            writer: {
                email: body.email,
                name: body.name
            }
        }
        
        let result = await replyMongo.replyInsert(data);

        if(result == 'ok') res.json({status: 'OK'});
        else res.json({status: 'NO'});        
    },

    deleteReply: async (req, res, next) => {
        let body = req.body;
        let data = {
            _id: mongoose.Types.ObjectId(body.reply_id)
        }

       replyMongo.replyDelete(data);

        res.json({status: 'OK'});
        // else res.json({status: 'NO'});   
    }
}