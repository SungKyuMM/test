const { render } = require("../app");
const { get } = require("../routes");
const navMongo = require('../mongoDB/navMongo');
const nav = require("../mongoDB/schema/nav");
const mongoose = require("mongoose");

module.exports = {
    showList: async (req, res, next) => {
        let data2 = [
            {
                'writer.email': req.user.email,
                'writer.name': req.user.name,
                'reg_date': {
                    $gte : new Date('2020-12-20')
                }
            }
        ];
        let count = await navMongo.countnav(data2);
        let start = false;
        let end = false;
        let nowPage = req.query.startPage;
        let lastPageNum = parseInt(count / 10);

        if(count % 10 != 0) lastPageNum += 1;

        if(nowPage > 1) start = true;
        if(lastPageNum > 1) end = true;
        if(lastPageNum == nowPage) end = false;

        let data = {
            email: req.user.email,
            name: req.user.name,
            reg_date: new Date().toISOString().substring(0, 10),
            sort: -1,
            maxPage: 10,
            startPage: (nowPage-1) * 10
        };

        let navList = await navMongo.typePaging(data);
        let navNum = count-((nowPage-1)*data.maxPage);

        res.render('navList', {list: navList, nowPage: nowPage, start: start, end: end, navNum: navNum});
    }, 

    
    shownav: async (req, res, next) => {
        let data = 
            {
                'writer.email': req.user.email,
                'writer.name': req.user.name,
                'reg_date': {
                    $gte : new Date('2020-12-20')
                }
            };
        let nav = await navMongo.findnav(data);
        res.render('navList', {nav: nav});
    },
    
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
            res.redirect(`/nav?startPage=1`);
        }
    },

    modifynav: async (req, res, next) => {
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
            res.redirect(`/nav?startPage=1`);
        }
    },

    deletenav: (req, res, next) => {
        let id = req.body.id;
        let data = {_id: mongoose.Types.ObjectId(id)};

        navMongo.deletenav(data);
        res.redirect(`/nav?startPage=1`);
    }
};