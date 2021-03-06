var express = require('express');
var router = express.Router();

const infectionController = require('../controller/infectionStatusController');
const safetyNewsController = require('../controller/safeNewsController');
const overSeaOutController = require('../controller/overSeaOutController');
const cityStatusController = require('../controller/cityStatusController');
const ageGenderController = require('../controller/ageGenderController');
const smsController = require('../controller/smsController');
const { route } = require('.');

// 국가·지역별 최신안전소식(코로나관련) 페이지
router.get('/safePaging', safetyNewsController.safePaging);

// 국가·지역별 최신안전소식(코로나관련) 내용
router.get('/safeContent', safetyNewsController.safeContent);

// 세계지도 차트 페이지
router.get('/world', overSeaOutController.worldStatus);

// 국내 지도 페이지
router.get('/city', cityStatusController.ko);

// 성별/나이 정보 페이지
router.get('/ageGender', ageGenderController.todayInfo);

// 코로나 감염현황 페이지
router.get('/infection', infectionController.showInfection);

// 코로나 감염현황 날짜 검색
router.post('/infectionSearch', infectionController.searchInfection);

// 세계지역 검색 페이지
router.get('/overseaout', overSeaOutController.showOverseaout);

// 세계지역 검색 지역명 설정 시 국가명 설정 기능
router.post('/overseaAreaGroup', overSeaOutController.areaGroup);

// 세계지역 검색 기능
router.post('/overseaoutSearch', overSeaOutController.searchOverSeaOut);

// 긴급재난문자
router.get('/sms', smsController.smsInfo);

// 긴급재난문자 검색
router.post('/smsSearch', smsController.searchSMS);

// 코로나사이트 크롤링 테스트
router.get('/crawling', smsController.todaySmsInfo);

// 샘플페이지
router.get('/sample', (req, res, next)=>{
    res.render('sample');
});

module.exports = router;