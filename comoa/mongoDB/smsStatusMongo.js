const smsStatus = require('../mongoDB/schema/ageGenderStatus');

module.exports = {
    insertMany: (data, msg) => {
        smsStatus.insertMany(data, (err) => {
            if(err) console.log(`smsStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    findOne: async (data) => {
        return new Promise (resolve => {
            smsStatus.findOne(data, (err, result) => {
               if(err) console.log(`smsStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }, 

    findMany: async (data) => {
        return new Promise (resolve => {
            smsStatus.find(data, (err, result) => {
               if(err) console.log(`smsStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }
};
