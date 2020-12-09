const AgeGenderStatus = require('../mongoDB/schema/ageGenderStatus');

var mongo = {};

mongo.insertMany = (data, msg) => {
    AgeGenderStatus.insertMany(data, (err) => {
        if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
        else {
            if(msg) console.log(msg);
        }
    });
};

mongo.findOne = async (data) => {
    return new Promise (resolve => {
        AgeGenderStatus.findOne(data, (err, result) => {
           if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
           else {
               resolve(result);
           }
        });
    });
};

module.exports = mongo;