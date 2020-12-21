const mongodb = require('mongoose'),
    { Schema } = require("mongoose");
const navSchema = new mongodb.Schema({    
    title: String,
    latitude: String,
    longitude: String,
    reg_date: Date,
    writer: {type: Schema.Types, ref: "Users"}
});

module.exports = mongodb.model('nav', navSchema);