const mongodb = require('mongoose'),
    { Schema } = require("mongoose");
const replySchema = new mongodb.Schema({        
    content: String,
    board_id: {type: Schema.Types.ObjectId, ref: "Board"},
    reg_date: Date,
    writer: {type: Schema.Types, ref: "Users"}
});

module.exports = mongodb.model('reply', replySchema);