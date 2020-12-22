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
    
    allCount: async (data) => {
        return new Promise (resolve => {
            smsStatus.countDocuments(data, (err, result) => {
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
            smsStatus.findOne({},(err, result) => {
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
    indexfindMany: async (data) => {
        return new Promise (resolve => {
            let res = smsStatus.find()
            .sort({md101_sn: -1})
            .limit(3);
            
            resolve(res);
        });
    },
    paging: async (data, sqldata) => {
        return new Promise (resolve => {
            let page = smsStatus.find(sqldata)
            .sort({md101_sn: -1})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(page);
        });
    },
    count: async (data) => {
        return new Promise (resolve => {
            smsStatus.countDocuments(data, (err, result) => {
                if(err) console.log(`smsStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    smsPaging: async (data) => {
        return new Promise (resolve => {
            let result = smsStatus.find(data.search)
            .sort({md101_sn: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(result);
        });
    }
};
