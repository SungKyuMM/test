const AgeGenderStatus = require('../mongoDB/schema/ageGenderStatus');

module.exports = {
    insertMany: (data, msg) => {
        AgeGenderStatus.insertMany(data, (err) => {
            if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    findOne: async (data) => {
        return new Promise (resolve => {
            AgeGenderStatus.findOne(data, (err, result) => {
               if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }, 

    findMany: async (data) => {
        return new Promise (resolve => {
            AgeGenderStatus.find(data, (err, result) => {
               if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }
};
