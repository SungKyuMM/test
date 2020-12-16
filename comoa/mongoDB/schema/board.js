const mongodb = require('mongoose'),
    { Schema } = require("mongoose");
const boardSchema = new mongodb.Schema({    
    title: String,
    content: String,
    type: String,
    reg_date: Date,
    writer: {type: Schema.Types, ref: "Users"}
});

module.exports = mongodb.model('Board', boardSchema);