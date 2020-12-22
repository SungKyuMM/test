const SafetyNews = require('./schema/safetyNews');

// 국가·지역별 최신안전소식(코로나관련) 몽고DB
module.exports = {
    // 데이터 저장
    insertMany: (data, msg) => {
        SafetyNews.insertMany(data, (err) => {
            if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
            else {
                if(msg) console.log(msg);
            }
        });
    },

    // 데이터 수정 upsert
    updateMany: (data) => {
        SafetyNews.updateOne({title: data.title}, {$set: data}, {upsert: true}, (err) => {
            if(err) throw err;
        });
    },

    // 데이터 _id이용 출력
    safeContent: async (data) => {
        return new Promise (resolve => {
            SafetyNews.findById(data, (err, result) => {
               if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
               else {                
                   resolve(result);
               }
            });
        });
    },

    // 데이터 하나 찾기
    findOne: async (data) => {
        return new Promise (resolve => {
            SafetyNews.findOne(data, (err, result) => {
               if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
               else {                
                   resolve(result);
               }
            });
        });
    },

    // 가장 최신 데이터 찾기
    findNew: async (data) => {
        return new Promise (resolve => {
            let result = SafetyNews.find({}).sort(data).limit(1);
            resolve(result);
        });
    },

    // 총 데이터 갯수
    allCount: async () => {
        return new Promise (resolve => {
            SafetyNews.countDocuments({}, (err, result) => {
                if(err) console.log(`SafetyNews MongoDB Error: ${err}`);
                else {                    
                    resolve(result);
                }
            });
        });
    },

    // 데이터 페이징
    paging: async (data) => {
        return new Promise (resolve => {
            let page = SafetyNews.find({})
            .sort({create_dt: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);

            resolve(page);
        });
    }

};