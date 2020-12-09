var express = require('express');
var coronaService = require('../service/coronaService');
var router = express.Router();

const InfectionStatus = require('../mongoDB/schema/infectionStatus');

// 테이스용 페이지 (나중에 폭발)
router.get('/', (req, res, next) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end("<h1>Test Page</h1>");
});

router.get('/info', async(req, res, next) => {
    let safetyData = await coronaService.safetyNews();    
    let infectionData = await coronaService.infectionStatus();
    let ageGenderData = await coronaService.ageGenderStatus();
    let cityData = await coronaService.cityStatus();
    let overseaData = await coronaService.overseaOutbreak();

    res.render('coronaInfo', {safetyData: safetyData, infectionData: infectionData, ageGenderData: ageGenderData, cityData: cityData, overseaData: overseaData});    
});

router.get('/test', (req, res) => {
    InfectionStatus.findOne({}, (err, result) => {
        if(err) console.log('에러');
        else {            
            var check = false;
            if(result != null) check = true; // 최신 데이터
            
            coronaService.infectionStatus(check);
        }
    }); 
    res.end('test');
});

module.exports = router;