const AgeGenderStatus = require('../mongoDB/schema/ageGenderStatus');

// 코로나19 연령, 성별감염 상황 몽고DB 쿼리
module.exports = {
    
    // 데이터 저장
    insertMany: (data, msg) => {
        AgeGenderStatus.insertMany(data, (err) => {
            if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    // 데이터 하나 잧기
    findOne: async (data) => {
        return new Promise (resolve => {
            AgeGenderStatus.findOne(data, (err, result) => {
               if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }, 

    // 데이터 복수 찾기
    findMany: async (data) => {
        return new Promise (resolve => {
            AgeGenderStatus.find(data, (err, result) => {
               if(err) console.log(`AgeGenderStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    }
};
