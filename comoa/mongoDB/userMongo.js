const User = require('./schema/user');

module.exports = {
    insertMany: (data) => {
        User.insertMany(data, (err) => {
            if(err) console.log(`Users MongoDB Error: ${err}`);
        });
    },
    
    findOne: async (data) => {
        return new Promise (resolve => {
            User.findOne(data, (err, result) => {
                if(err) console.log('Mongo DB 에러');
                else resolve(result);
            });
        });
    },

    updateOne: async (query, data) => {
        return new Promise (resolve => {
            User.updateOne(query, data, (err) => {
                if(err) console.log('Mongo DB 에러');
                else resolve("ok");
            });
        });
    },

    deleteUser: (data) => {
        User.deleteOne(data, (err) => {
            if(err) console.log('Mongo DB 에러');
        });
    }
}