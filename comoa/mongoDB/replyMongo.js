const Reply = require('./schema/reply');

// 댓글 몽고 DB
module.exports = {
    // 해당 데이터 출력
    replyList: async (data) => {
        return new Promise (resolve => {
            let replies = Reply.find(data).sort({reg_date: -1});
            resolve(replies);
        });
    }, 

    // 데이터 저장
    replyInsert: async (data) => {
        return new Promise (resolve => {
            Reply.insertMany(data, (err) => {
                if(err) console.log(`Reply MongoDB Error: ${err}`);
                else {                    
                    resolve("ok");
                }
            });
        });
    },

    // 데이터 수정
    replyUpdate: async (query, data) => {
        return new Promise (resolve => {
            Reply.updateMany(query, data, (err) => {
                if(err) console.log(`Reply MongoDB Error: ${err}`);
                else {                    
                    resolve("ok");
                }
            });
        });
    },

    // 데이터 삭제
    replyDelete: (data) => {
        Reply.deleteMany(data, (err) => {
            if(err) console.log(`Reply MongoDB Error: ${err}`);            
        });
    }
};