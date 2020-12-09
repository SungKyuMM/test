const OverseaOutbreak = require('../mongoDB/schema/overseaOutbreak');

var mongo = {};

mongo.insertMany = (data, msg) => {
    OverseaOutbreak.insertMany(data, (err) => {
        if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
        else {
            if(msg) console.log(msg);
        }
    });
};

mongo.updateMany = (data) => {
    OverseaOutbreak.updateOne({seq: data.seq}, {$set: data}, {upsert: true}, (err) => {
        if(err) throw err;
    });
};

mongo.findOne = async (data) => {
    return new Promise (resolve => {
        OverseaOutbreak.findOne(data, (err, result) => {
           if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
           else {
               resolve(result);
           }
        });
    });
};


module.exports = mongo;