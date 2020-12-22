const User = require('./schema/user');

// 회원 몽고DB
module.exports = {
    // 데이터 저장
    insertMany: (data) => {
        User.insertMany(data, (err) => {
            if(err) console.log(`Users MongoDB Error: ${err}`);
        });
    },
    
    // 데이터 하나 찾기
    findOne: async (data) => {
        return new Promise (resolve => {
            User.findOne(data, (err, result) => {
                if(err) console.log('Mongo DB 에러');
                else resolve(result);
            });
        });
    },

    // 데이터 하나 수정
    updateOne: async (query, data) => {
        return new Promise (resolve => {
            User.updateOne(query, data, (err) => {
                if(err) console.log('Mongo DB 에러');
                else resolve("ok");
            });
        });
    },

    // 데이터 하나 삭제
    deleteUser: (data) => {
        User.deleteOne(data, (err) => {
            if(err) console.log('Mongo DB 에러');
        });
    }
}