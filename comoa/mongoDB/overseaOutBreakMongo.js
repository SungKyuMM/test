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
    }
};
