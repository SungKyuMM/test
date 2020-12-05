var express = require('express');
var request = require('request');
var convert = require('xml-js');
var coronaService = require('../service/coronaService');
var router = express.Router();

// 테이스용 페이지 (나중에 폭발)
router.get('/', (req, res, next) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end("<h1>Test Page</h1>");
});

router.get('/info', async(req, res, next) => {
    let safetyData = await coronaService.safetyNews();    
    let infectionData = await coronaService.infectionStatus();

    res.render('coronaInfo', {safetyData: safetyData, infectionData: infectionData});    
});

module.exports = router;