const { SchemaTypes } = require('mongoose');
const replyMongo = require('../mongoDB/replyMongo');
const mongoose = require("mongoose");

module.exports = {
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
        
        let replies;
        let result = await replyMongo.replyInsert(data);
        if(result == 'ok')
            replies = await replyMongo.replyList({board_id: mongoose.Types.ObjectId(body.id)});
        
        res.json({replies: replies});
    },

    deleteReply: async (req, res, next) => {
        let body = req.body;

        console.log(body);


        res.end();
    }
}