const OverseaOutbreak = require('../mongoDB/schema/overseaOutbreak');

// 코로나19 해외발생 현황 몽고DB 쿼리
module.exports = {
    // 데이터 찾기
    insertMany: (data, msg) => {
        OverseaOutbreak.insertMany(data, (err) => {
            if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },

    // 데이터 수정 upsert
    updateMany: (data) => {
        OverseaOutbreak.updateOne({seq: data.seq}, {$set: data}, {upsert: true}, (err) => {
            if(err) throw err;
        });
    },

    // 데이터 하나 찾기
    findOne: async (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.findOne(data, (err, result) => {
               if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            });
        });
    },

    // 데이터 복수 찾기
    find: (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.find(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    // 데이터 낳짜 출력
    finday: (data) =>{
        return new Promise (resolve => {
            OverseaOutbreak.aggregate(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }, 

    // 데이터 전체 갯수
    count: async (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.countDocuments(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    // 데이터 페이징
    overseaoutPaging: async (data) => {
        return new Promise (resolve => {
            let result = OverseaOutbreak.find(data.search)
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(result);
        });
    },

    // 데이터 중복제거
    overseaoutDistinct: async (data) => {
        return new Promise (resolve => {
            OverseaOutbreak.distinct(data, (err, result) => {
                if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    }
};
