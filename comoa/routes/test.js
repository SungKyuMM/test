var express = require('express');
// var coronaService = require('../service/coronaService');
var router = express.Router();

const infectionController = require('../controller/infectionStatusController');
const safetyNewsController = require('../controller/safeNewsController');
const overSeaOutController = require('../controller/overSeaOutController');
const cityStatusController = require('../controller/cityStatusController');
const ageGenderController = require('../controller/ageGenderController');
const smsController = require('../controller/smsController');
const { route } = require('.');

// 테이스용 페이지 (나중에 폭발)
router.get('/', (req, res, next) => {
    res.render('test');
});

// router.get('/info', async(req, res, next) => {
//     let safetyData = await coronaService.safetyNews();    
//     let infectionData = await coronaService.infectionStatus();
//     let ageGenderData = await coronaService.ageGenderStatus();
//     let cityData = await coronaService.cityStatus();
//     let overseaData = await coronaService.overseaOutbreak();

//     res.render('coronaInfo', {safetyData: safetyData, infectionData: infectionData, ageGenderData: ageGenderData, cityData: cityData, overseaData: overseaData});    
// });

router.get('/t2', infectionController.infectionGraph);

router.get('/safePaging', safetyNewsController.safePaging);

router.get('/safeContent', safetyNewsController.safeContent);

router.get('/world', overSeaOutController.worldStatus);

router.get('/city', cityStatusController.allInfo);

router.get('/ageGender', ageGenderController.todayInfo);

router.get('/infection', infectionController.showInfection);

router.get('/sms', smsController.todaySmsInfo);

// 세계지역검색 - 공사중..
router.get('/sample', (req, res, next)=>{
    res.render('sample');
});

module.exports = router;