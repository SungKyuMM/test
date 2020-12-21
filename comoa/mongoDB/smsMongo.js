const smsStatus = require('../mongoDB/schema/sms');

module.exports = {
    insertMany: (data, msg) => {
        smsStatus.insertMany(data, (err) => {
            if(err) console.log(`smsStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    allCount: async () => {
        return new Promise (resolve => {
            smsStatus.countDocuments({}, (err, result) => {
                if(err) console.log(`smsStatus MongoDB Error: ${err}`);
                else {                    
                    resolve(result);
                }
            });
        });
    },
    find: async (data) => {
        return new Promise (resolve => {
            smsStatus.find(data, (err, result) => {
               if(err) console.log(`smsStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }, 

    findOne: async (data) => {
        return new Promise (resolve => {
            smsStatus.findOne(data, (err, result) => {
               if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            }).sort(data).limit(1);;
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
    },
    paging: async (data) => {
        return new Promise (resolve => {
            let page = smsStatus.find({})
            .sort({md101_sn: -1})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(page);
        });
    }

};
