const CityStatus = require('./schema/cityStatus');

// 코로나19 시·도발생 현황 몽고DB 쿼리
module.exports = {
    // 데이터 저장
    insertMany: (data, msg) => {
        CityStatus.insertMany(data, (err) => {
            if(err) console.log(`CityStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    // 데이터 하나 찾기
    findOne: async (data) => {
        return new Promise (resolve => {
            CityStatus.findOne(data, (err, result) => {
               if(err) console.log(`CityStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    // 데이터 복수 찾기
    findMany: async (data) => {
        return new Promise (resolve => {
            CityStatus.find(data, (err, result) => {
                if(err) console.log(`CityStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    // 데이터 날짜 찾기
    finday: async (data) => {
        return new Promise (resolve => {
            CityStatus.aggregate(data, (err, result) => {
                if(err) console.log(`CityStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }


    

};