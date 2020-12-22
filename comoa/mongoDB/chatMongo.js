const chatM = require('./schema/chat');

module.exports = {
    chatList: async () => {
        return new Promise (resolve => {
            chatM.find((err, result) => {
                if(err) console.log(`nav MongoDB Error: ${err}`);
                else resolve(result);
            }).limit(100);
        });
    }, 

    chatInsert: async (data) => {
        return new Promise (resolve => {
            chatM.insertMany(data, (err) => {
                if(err) console.log(`chatM MongoDB Error: ${err}`);
                else {                    
                    resolve("ok");
                }
            });
        });
    },

};