const InfectionStatus = require('../mongoDB/schema/infectionStatus');

module.exports = {

    insertMany: (data, msg) => {
        InfectionStatus.insertMany(data, (err) => {
            if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    findOne: async (data) => {
        return new Promise (resolve => {
            InfectionStatus.findOne(data, (err, result) => {
               if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    },
    
    find: async (data) => {
        return new Promise (resolve => {
            InfectionStatus.find(data, (err, result) => {
                if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }, 

    infectionPaging: async (data) => {
        return new Promise (resolve => {
            let result = InfectionStatus.find(data).sort({create_dt: -1});
            resolve(result);
        });
    },

    count: async () => {
        return new Promise (resolve => {
            let result = InfectionStatus.find({}).count;
            resolve(result);
        });
    }
}