var express = require('express');
var coronaService = require('../service/coronaService');
var router = express.Router();

const infectionMongo = require('../mongoDB/infectionStatusMongo');
const safetyNewsMongo = require('../mongoDB/safetyNewsMongo');

// 테이스용 페이지 (나중에 폭발)
router.get('/', (req, res, next) => {
    res.render('test');
});

router.get('/info', async(req, res, next) => {
    let safetyData = await coronaService.safetyNews();    
    let infectionData = await coronaService.infectionStatus();
    let ageGenderData = await coronaService.ageGenderStatus();
    let cityData = await coronaService.cityStatus();
    let overseaData = await coronaService.overseaOutbreak();

    res.render('coronaInfo', {safetyData: safetyData, infectionData: infectionData, ageGenderData: ageGenderData, cityData: cityData, overseaData: overseaData});    
});

router.get('/t2', async (req, res) => {
    let data = {create_dt: {$gte: new Date("2020-11-01")}};
    let infectionData = await infectionMongo.find(data);
    // console.log(infectionData);
    // let infectionData = await coronaService.infectionStatus();
    res.render('t2', {infectionData: infectionData});
});

router.get('/safePaging', async (req, res) => {
    let count = await safetyNewsMongo.allCount();  
    let start = false;
    let end = false;
    let nowPage = req.query.startPage;
    let lastPageNum = parseInt(count / 10);
            
    if(count % 10 != 0) lastPageNum += 1;

    if(nowPage > 1) start = true;
    if(lastPageNum > 1) end = true;
    if(lastPageNum == nowPage) end = false;

    let data = {
        sort: -1,
        maxPage: 10,
        startPage: (nowPage-1) * 10
    };

    let post = await safetyNewsMongo.paging(data);
    res.render('testSafetyNews', {post: post, nowPage: nowPage, start: start, end: end});
});

router.get('/safeContent', async (req, res) => {

    let data = {title: req.query.title};
    let safeContent = await safetyNewsMongo.findOne(data);

    res.render('testSafetyNewsContent', {safeContent: safeContent});
});

module.exports = router;