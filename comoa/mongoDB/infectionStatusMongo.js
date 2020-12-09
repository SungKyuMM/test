const InfectionStatus = require('../mongoDB/schema/infectionStatus');

var mongo = {};

mongo.insertMany = (data, msg) => {
    InfectionStatus.insertMany(data, (err) => {
        if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
        else {
            if(msg) console.log(msg);
        }
    });
};

mongo.findOne = async (data) => {
    return new Promise (resolve => {
        InfectionStatus.findOne(data, (err, result) => {
           if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
           else {
               resolve(result);
           }
        });
    });
};

module.exports = mongo;