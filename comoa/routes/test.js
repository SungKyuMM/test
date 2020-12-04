var express = require('express');
var router = express.Router();

// 테이스용 페이지 (나중에 폭발)
router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end("<h1>Test Page</h1>");
});

router.get('/info', function(req, res, next) {

    let key = 'key'
    let url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19GenAgeCaseInfJson?serviceKey=' + key + '&pageNo=1&numOfRows=10&startCreateDt=20200310&endCreateDt=20200414';

    console.log(url);

    res.render('coronaInfo');
});

module.exports = router;