const nav = require('./schema/nav');

module.exports = {

    // 위치추적 조회 페이지
    navList: async (data) => {
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

    // 위치추적 조회 검색 시 사용
    navSearchList: async (data) => {
        return new Promise (resolve => {
            let navList = nav.find({
                'writer.name':data.name,
                'writer.email':data.email,
                'reg_date': {
                    $gte : new Date(data.start),
                    $lte : new Date(data.end)
                }
            }).sort({reg_date:data.sort});
            
            resolve(navList);
        });
    },
    
    // 네비정보 등록
    registernav: (data) => {
        nav.insertMany(data, (err) => {
            if(err) console.log(`nav MongoDB Error: ${err}`);
        });
    }
    /*
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

    //
    findnav: async (data) => {
        return new Promise (resolve => {
            nav.find(data, (err, result) => {
                if(err) console.log(`nav MongoDB Error: ${err}`);
                else resolve(result);
            });
        });
    },
*/

/*
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
*/
    
};