const Reply = require('./schema/reply');

module.exports = {
    replyList: async (data) => {
        return new Promise (resolve => {
            let replies = Reply.find(data).sort({reg_date: -1});
            resolve(replies);
        });
    }, 

    replyInsert: async (data) => {
        return new Promise (resolve => {
            Reply.insertMany(data, (err) => {
                if(err) console.log(`Reply MongoDB Error: ${err}`);
                else {                    
                    resolve("ok");
                }
            });
        });
    },

    replyUpdate: async (query, data) => {
        return new Promise (resolve => {
            Reply.updateMany(query, data, (err) => {
                if(err) console.log(`Reply MongoDB Error: ${err}`);
                else {                    
                    resolve("ok");
                }
            });
        });
    },

    replyDelete: (data) => {
        Reply.deleteMany(data, (err) => {
            if(err) console.log(`Reply MongoDB Error: ${err}`);            
        });
    }
};