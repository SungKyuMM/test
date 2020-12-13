const User = require('./schema/user');

var mongo = {};

mongo.insertMany = (data) => {
    User.insertMany(data, (err) => {
        if(err) console.log(`Users MongoDB Error: ${err}`);
    });
};

mongo.findOne = (data) => {
    return new Promise (resolve => {
        User.findOne(data, (err, result) => {
            if(err) console.log('Mongo DB 에러');
            else resolve(result);
        });
    });
}

module.exports = mongo;



