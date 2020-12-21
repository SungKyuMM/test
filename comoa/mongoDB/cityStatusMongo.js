const CityStatus = require('./schema/cityStatus');

module.exports = {
    insertMany: (data, msg) => {
        CityStatus.insertMany(data, (err) => {
            if(err) console.log(`CityStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    findOne: async (data) => {
        return new Promise (resolve => {
            CityStatus.findOne(data, (err, result) => {
               if(err) console.log(`CityStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    findMany: async (data) => {
        return new Promise (resolve => {
            CityStatus.find(data, (err, result) => {
                if(err) console.log(`CityStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    finday: async (data) => {
        return new Promise (resolve => {
            CityStatus.aggregate(data, (err, result) => {
                if(err) console.log(`CityStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }


    

};