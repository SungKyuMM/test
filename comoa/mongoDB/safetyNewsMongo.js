const SafetyNews = require('./schema/safetyNews');

var mongo = {};

mongo.insertMany = (data, msg) => {
    SafetyNews.insertMany(data, (err) => {
        if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
        else {
            if(msg) console.log(msg);
        }
    });
};


mongo.findOne = async (data) => {
    return new Promise (resolve => {
        SafetyNews.findOne(data, (err, result) => {
           if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
           else {
               resolve(result);
           }
        });
    });
};



module.exports = mongo;