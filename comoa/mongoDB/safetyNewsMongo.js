const SafetyNews = require('./schema/safetyNews');

module.exports = {
    insertMany: (data, msg) => {
        SafetyNews.insertMany(data, (err) => {
            if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },

    updateMany: (data) => {
        SafetyNews.updateOne({title: data.title}, {$set: data}, {upsert: true}, (err) => {
            if(err) throw err;
        });
    },

    safeContent: async (data) => {
        return new Promise (resolve => {
            SafetyNews.findById(data, (err, result) => {
               if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
               else {                
                   resolve(result);
               }
            });
        });
    },

    findOne: async (data) => {
        return new Promise (resolve => {
            SafetyNews.findOne(data, (err, result) => {
               if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
               else {                
                   resolve(result);
               }
            });
        });
    },

    findNew: async (data) => {
        return new Promise (resolve => {
            let result = SafetyNews.find({}).sort(data).limit(1);
            resolve(result);
        });
    },

    allCount: async () => {
        return new Promise (resolve => {
            SafetyNews.countDocuments({}, (err, result) => {
                if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
                else {                    
                    resolve(result);
                }
            });
        });
    },

    paging: async (data) => {
        return new Promise (resolve => {
            let page = SafetyNews.find({})
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(page);
        });
    }

};