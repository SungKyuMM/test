const Board = require('./schema/board');

// 게시글 몽고DB 쿼리
module.exports = {
    // 타입 별 페이징 데이터
    typePaging: async (data) => {
        return new Promise (resolve => {
            let boarList = Board.find({type: data.type})
            .sort({reg_date: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);
            
            resolve(boarList);
        });
    },

    // 타입 별 전체 데이터 갯수
    countBoard: async (type) => {
        return new Promise (resolve => {
            Board.countDocuments({type: type}, (err, result) => {
                if(err) console.log(`Board MongoDB Error: ${err}`);
                else {                    
                    resolve(result);
                }
            });
        });
    },

    // _id 게시글 데이터 찾기
    findBoard: async (data) => {
        return new Promise (resolve => {
            Board.findById(data, (err, result) => {
                if(err) console.log(`Board MongoDB Error: ${err}`);
                else resolve(result);
            });
        });
    },

    // 게시글 데이터 저장
    registerBoard: (data) => {
        Board.insertMany(data, (err) => {
            if(err) console.log(`Board MongoDB Error: ${err}`);
        });
    },

    // 게시글 데이터 수정    
    updateBoard: (query, data) => {
        Board.updateOne(query, data, (err) => {
            if(err) console.log(`Board MongoDB Error: ${err}`);
        });
    }, 

    // 게시글 데이터 삭제
    deleteBoard: (data) => {
        Board.deleteOne(data, (err) => {
            if(err) console.log(`Board MongoDB Error: ${err}`);
        });
    }
};