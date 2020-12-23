const smsStatus = require('../mongoDB/schema/sms');

module.exports = {

    // 데이터 저장
    insertMany: (data, msg) => {
        smsStatus.insertMany(data, (err) => {
            if(err) console.log(`smsStatus MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },
    
    // 특정 컬럼으로 정렬한뒤 1개 컬럼찾기
    findOne: async (data) => {
        return new Promise (resolve => {
            smsStatus.findOne({},(err, result) => {
               if(err) console.log(`OverseaOutbreak MongoDB Error: ${err}`);
               else {
                   resolve(result);
               }
            }).sort(data).limit(1);;
        });
    },

    // 데이터 카운트 조회
    count: async (data) => {
        return new Promise (resolve => {
            smsStatus.countDocuments(data, (err, result) => {
                if(err) console.log(`smsStatus MongoDB Error: ${err}`);
                else {
                   resolve(result);
                }
            });
        });
    },

    // 페이지화 리스트 구현
    smsPaging: async (data) => {
        return new Promise (resolve => {
            let result = smsStatus.find(data.search)
            .sort({md101_sn: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(result);
        });
    }
};
