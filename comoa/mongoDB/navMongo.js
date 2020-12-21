const nav = require('./schema/nav');

module.exports = {
    typePaging: async (data) => {
        return new Promise (resolve => {
            let navList = nav.find({
                'writer.name':data.name,
                'writer.email':data.email,
                'reg_date': {
                    $gte : new Date(data.reg_date)
                }
            }).sort({reg_date:data.sort});
            
            resolve(navList);
        });
    },

    countnav: async (type) => {
        return new Promise (resolve => {
            nav.countDocuments({type: type}, (err, result) => {
                if(err) console.log(`nav MongoDB Error: ${err}`);
                else {                    
                    resolve(result);
                }
            });
        });
    },

    findnav: async (data) => {
        return new Promise (resolve => {
            nav.find(data, (err, result) => {
                if(err) console.log(`nav MongoDB Error: ${err}`);
                else resolve(result);
            });
        });
    },

    registernav: (data) => {
        nav.insertMany(data, (err) => {
            if(err) console.log(`nav MongoDB Error: ${err}`);
        });
    },

    updatenav: (query, data) => {
        nav.updateOne(query, data, (err) => {
            if(err) console.log(`nav MongoDB Error: ${err}`);
        });
    }, 

    deletenav: (data) => {
        nav.deleteOne(data, (err) => {
            if(err) console.log(`nav MongoDB Error: ${err}`);
        });
    }
};