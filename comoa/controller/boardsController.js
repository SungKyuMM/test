const { render } = require("../app");
const { get } = require("../routes");
const boardMongo = require('../mongoDB/boardMongo');
const board = require("../mongoDB/schema/board");
const mongoose = require("mongoose");

module.exports = {
    showList: async (req, res, next) => {
        let type = req.params.type;

        let count = await boardMongo.countBoard(type);
        let start = false;
        let end = false;
        let nowPage = req.query.startPage;
        let lastPageNum = parseInt(count / 10);

        if(count % 10 != 0) lastPageNum += 1;

        if(nowPage > 1) start = true;
        if(lastPageNum > 1) end = true;
        if(lastPageNum == nowPage) end = false;

        let data = {
            type: type,
            sort: -1,
            maxPage: 10,
            startPage: (nowPage-1) * 10
        };

        let boardList = await boardMongo.typePaging(data);

        res.render('testboards', {type: data.type, list: boardList, nowPage: nowPage, start: start, end: end});
    }, 

    showBoard: async (req, res, next) => {
        let type = req.params.type;
        let _id = req.params._id

        let board = await boardMongo.findBoard(_id);
        
        res.render('testShowBoard', {type: type, board: board});
    },

    registerBoard: (req, res, next) => {
        let type = req.params.type;

        if(req.method === 'GET') {
            res.render('testregisterBoard', {type: type});
        } else {
            let body = req.body;
            let data = {
                title: body.title,                
                content: body.content,
                type: type,
                reg_date: new Date,
                writer: {
                    email: req.user.email,
                    name: req.user.name
                }
            };

            boardMongo.registerBoard(data);
            res.redirect(`/boards/${type}`);
        }
    },

    modifyBoard: async (req, res, next) => {
        let _id = req.params._id

        if(req.method === 'GET') {
            let board = await boardMongo.findBoard(_id);

            res.render('testmodifyBoard', {board: board});
        } else {
            let body = req.body;
            console.log(body);
            let query = {_id: mongoose.Types.ObjectId(body.id)};
            let data = {
                $set: {
                    title: body.title,
                    content: body.content
                }
            }
            boardMongo.updateBoard(query, data);
            res.redirect(`/boards/${body.type}`);
        }
    },

    deleteBoard: (req, res, next) => {
        let type = req.params.type;
        let id = req.body.id;
        let data = {_id: mongoose.Types.ObjectId(id)};

        boardMongo.deleteBoard(data);
        res.redirect(`/boards/${type}`);
    }
};