const { render } = require("../app");
const { get } = require("../routes");
const navMongo = require('../mongoDB/navMongo');
const mongoose = require("mongoose");
const { searchnav } = require("../mongoDB/navMongo");

module.exports = {

    // 오늘 날짜 리스트업
    showList: async (req, res, next) => {
        
        // 오늘 날짜 구하기
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1) + '';
        let day = date.getDate();

        if(day < 10) {
            day += '';
            day = '0' + day;
        }
        
        let now = new Date(year + '-' + month + '-' + day);  
        let data = {
            email: req.user.email,
            name: req.user.name,
            reg_date: new Date(now),
            sort: -1
        };
        let navList = await navMongo.navList(data);
        res.render('navList', {list: navList});
    }, 
    // 특정 날짜로 네비리스트 조회
    showSearchList: async (req, res, next) => {
        let data = {
            email: req.user.email,                      // 로그인 사용자 email
            name: req.user.name,                        // 로그인 사용자 name
            start: new Date(req.body.start),            // 검색할 시작 날짜
            end: new Date(req.body.end+ "T23:59:59"),   // 검색할 마지막 날짜
            sort: -1                                    // 정렬
        };
        //console.log('startday : ' + req.body.start);
        //console.log('endday : ' + req.body.end);
        let navList = await navMongo.navSearchList(data);

        res.json({list: navList});
    }, 
    // 네비 위치 등록
    registernav: (req, res, next) => {
        if(req.method === 'GET') {
            res.render('navAdd');
        } else {
            let body = req.body;
            let data = {
                title: body.title,                
                latitude: body.latitude,
                longitude: body.longitude,
                reg_date: new Date,
                writer: {
                    email: req.user.email,
                    name: req.user.name
                }
            };

            navMongo.registernav(data);
            res.redirect(`/nav`);       // 등록 후 조회페이지 이동
        }
    },

/*    modifynav: async (req, res, next) => {
        let _id = req.params._id

        if(req.method === 'GET') {
            let nav = await navMongo.findnav(_id);

            res.render('modifynav', {nav: nav});
        } else {
            let body = req.body;
            console.log(body);
            let query = {_id: mongoose.Types.ObjectId(body.id)};
            let data = {
                $set: {
                    title: body.title
                }
            }
            navMongo.updatenav(query, data);
            res.redirect(`/nav`);
        }
    },

    deletenav: (req, res, next) => {
        let id = req.body.id;
        let data = {_id: mongoose.Types.ObjectId(id)};

        navMongo.deletenav(data);
        res.redirect(`/nav`);
    },
    */
};