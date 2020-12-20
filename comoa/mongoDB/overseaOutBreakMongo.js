const OverseaOutbreak = require('../mongoDB/schema/overseaOutbreak');

module.exports = {
    insertMany: (data, msg) => {
        OverseaOutbreak.insertMany(data, (err) => {
            if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },

    updateMany: (data) => {
        OverseaOutbreak.updateOne({seq: data.seq}, {$set: data}, {upsert: true}, (err) => {
            if(err) throw err;
        });
    },

    findOne: async (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.findOne(data, (err, result) => {
               if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    },

    find: (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.find(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    finday: (data) =>{
        return new Promise (resolve => {
            OverseaOutbreak.aggregate(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }, 

    count: async (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.countDocuments(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    overseaoutPaging: async (data) => {
        return new Promise (resolve => {
            let result = OverseaOutbreak.find(data.search)
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(result);
        });
    },

    overseaoutDistinct: async (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.distinct(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }
};
