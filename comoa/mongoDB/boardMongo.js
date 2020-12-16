const Board = require('./schema/board');

module.exports = {
    typePaging: async (data) => {
        return new Promise (resolve => {
            let boarList = Board.find({type: data.type})
            .sort({reg_date: data.sort})
            .skip(data.startPage)
            .limit(data.maxPage);
            
            resolve(boarList);
        });
    },

    findBoard: async (data) => {
        return new Promise (resolve => {
            Board.findById(data, (err, result) => {
                if(err) console.log(`Board MongoDB Error: ${err}`);
                else resolve(result);
            });
        });
    },

    registerBoard: (data) => {
        Board.insertMany(data, (err) => {
            if(err) console.log(`Board MongoDB Error: ${err}`);
        });
    },

    updateBoard: (query, data) => {
        Board.updateOne(query, data, (err) => {
            if(err) console.log(`Board MongoDB Error: ${err}`);
        });
    }, 

    deleteBoard: (data) => {
        Board.deleteOne(data, (err) => {
            if(err) console.log(`Board MongoDB Error: ${err}`);
        });
    }
};