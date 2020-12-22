const InfectionStatus = require('../mongoDB/schema/infectionStatus');

// 코로나19 감염 현황 몽고DB
module.exports = {
    // 데이터 저장 및 메시지    
    insertMany: (data, msg) => {
        InfectionStatus.insertMany(data, (err) => {
            if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    // 데이터 하나 찾기
    findOne: async (data) => {
        return new Promise (resolve => {
            InfectionStatus.findOne(data, (err, result) => {
               if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    },
    
    // 데이터 복수 찾기
    find: async (data) => {
        return new Promise (resolve => {
            InfectionStatus.find(data, (err, result) => {
                if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }, 

    // 데이터 페이징 출력
    infectionPaging: async (data) => {
        return new Promise (resolve => {
            let result = InfectionStatus.find(data.search)
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(result);
        });
    },

    // 해당 전체 데이터 갯수
    count: async (data) => {
        return new Promise (resolve => {
            InfectionStatus.countDocuments(data, (err, result) => {
                if(err) console.log(`InfectionStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    // 수정 upsert
    updateInit: (data) => {
        InfectionStatus.updateOne({create_dt: {$gte: new Date(data.create_dt)}}, {$set: data}, {upsert: true}, (err) => {
            if(err) throw err;
        });
    },

    // 날짜 검색 시 데이터 출력
    dateSearch: async (data) => {
        return new Promise (resolve => {
            let result = InfectionStatus.find(data.search)
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);
            
            resolve(result);
        });
    }
}