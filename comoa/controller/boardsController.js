const { render } = require("../app");
const { get } = require("../routes");
const boardMongo = require('../mongoDB/boardMongo');
const board = require("../mongoDB/schema/board");
const mongoose = require("mongoose");
const replyMongo = require("../mongoDB/replyMongo");

module.exports = {
    // 게시글 리스트(페이징)
    showList: async (req, res, next) => {
        // 게시글 타입 선별(자유, 코로나)
        let type = req.params.type;

        // 전체 데이터 수, 현재 페이지 번호, 마지막 페이지 번호 등 변수
        let count = await boardMongo.countBoard(type);
        let start = false;
        let end = false;
        let nowPage = req.query.startPage;
        let lastPage = parseInt(count / 10);

        if(count % 10 != 0) lastPage += 1;

        // 페이징 버튼 활성화를 위한 변수 값 등록
        if(nowPage > 1) start = true;
        if(lastPage > 1) end = true;
        if(lastPage == nowPage) end = false;

        // 데이터 출력을 위한 JSON 형식
        let data = {
            type: type,
            sort: -1,
            maxPage: 10,
            startPage: (nowPage-1) * 10
        };

        // 게시글 내용 및 글 번호 값 계산
        let boardList = await boardMongo.typePaging(data);
        let boardNum = count-((nowPage-1)*data.maxPage);

        res.render('boards', {type: data.type, list: boardList, nowPage: nowPage, start: start, end: end, boardNum: boardNum, lastPage: lastPage});
    }, 

    // 게시글 내용 VIEW
    showBoard: async (req, res, next) => {        
        let type = req.params.type;                             // 게시글 타입
        let _id = req.params._id                                // 게시글 MongoDB _id
        let data = {board_id: mongoose.Types.ObjectId(_id)};    // _id를 이용한 데이터 find

        let board = await boardMongo.findBoard(_id);            // 데이터 출력
        let reply = await replyMongo.replyList(data);           // 해당 게시글의 _id를 가지고 있는 댓글정보 가져오기
        
        res.render('showBoard', {type: type, board: board, reply: reply});
    },

    // 게시글 등록
    registerBoard: (req, res, next) => {
        let type = req.params.type;                            // 게시글 타입

        if(req.method === 'GET') {                             // 요청 메소드 판별
            res.render('registerBoard', {type: type});         // GET일 경우 페이지 render
        } else {                                               // POST일 경우
            let body = req.body;
            let data = {                                       // 입력 데이터 값
                title: body.title,                
                content: body.content,
                type: type,
                reg_date: new Date,
                writer: {
                    email: req.user.email,
                    name: req.user.name
                }
            };

            boardMongo.registerBoard(data);                    // MongoDB에 저장
            res.redirect(`/boards/${type}?startPage=1`);
        }
    },

    // 게시글 수정
    modifyBoard: async (req, res, next) => {
        let _id = req.params._id;                                   // 해당 게시글 _id

        if(req.method === 'GET') {                                  // 요청 메소드 판별
            let board = await boardMongo.findBoard(_id);            // GET일 경우 해당 게시글 정보를 render페이지에 전달

            res.render('modifyBoard', {board: board});
        } else {                                                    // PUT일 경우
            let body = req.body;
            let query = {_id: mongoose.Types.ObjectId(body.id)};    // update 할 데이터
            let data = {                                            // update 수정 내용
                $set: {
                    title: body.title,
                    content: body.content
                }
            }
            boardMongo.updateBoard(query, data);                    // MongoDB update
            res.redirect(`/boards/${body.type}?startPage=1`);
        }
    },

    // 게시글 삭제
    deleteBoard: (req, res, next) => {
        let type = req.params.type;                                 // 페이지를 돌아가이 위한 타입 정보
        let id = req.body.id;                                       // 해당 게시글 _id
        let data = {_id: mongoose.Types.ObjectId(id)};              // MongoDB에 찾을 게시글 데이터
        let rData = {board_id: mongoose.Types.ObjectId(id)};        // MongoDB에 찾을 댓글 데이터

        boardMongo.deleteBoard(data);                               // 해당 _id 게시글 데이터 delete
        replyMongo.replyDelete(rData);                              // 해당 게시글 _id를 가지고 있는 댓글 데이터 delete
        
        res.redirect(`/boards/${type}?startPage=1`);
    }
};