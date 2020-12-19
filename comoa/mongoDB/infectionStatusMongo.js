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
            let result = InfectionStatus.find(data.search)
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(result);
        });
    },

    count: async (data) => {
        return new Promise (resolve => {
            InfectionStatus.countDocuments(data, (err, result) => {
                if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    updateInit: (data) => {
        InfectionStatus.updateOne({create_dt: {$gte: new Date(data.create_dt)}}, {$set: data}, {upsert: true}, (err) => {
            if(err) throw err;
        });
    },

    dateSearch: async (data) => {
        return new Promise (resolve => {
            let result = InfectionStatus.find(data.search)
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);
            
            resolve(result);
        });
    }
}