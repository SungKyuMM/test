const CityStatus = require('./schema/cityStatus');

var mongo = {};

mongo.insertMany = (data, msg) => {
    CityStatus.insertMany(data, (err) => {
        if(err) console.log(`CityStatus MongoDB Error: ${err}`);
        else {
            if(msg) console.log(msg);
        }
    });
};

mongo.findOne = async (data) => {
    return new Promise (resolve => {
        CityStatus.findOne(data, (err, result) => {
           if(err) console.log(`CityStatus MongoDB Error: ${err}`);
           else {
               resolve(result);
           }
        });
    });
};

module.exports = mongo;