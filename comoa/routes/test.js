var express = require('express');
var request = require('request');
var convert = require('xml-js');
var router = express.Router();

// 테이스용 페이지 (나중에 폭발)
router.get('/', function(req, res, next) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.end("<h1>Test Page</h1>");
});

router.get('/info', function(req, res, next) {

    var url = 'http://apis.data.go.kr/1262000/SafetyNewsList/getCountrySafetyNewsList';
    var queryParams = '?' + encodeURIComponent('ServiceKey') + '=service Key'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /* */
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* */
    queryParams += '&' + encodeURIComponent('title1') + '=' + encodeURIComponent('입국'); /* */
    queryParams += '&' + encodeURIComponent('title2') + '=' + encodeURIComponent('코로나'); /* */
    queryParams += '&' + encodeURIComponent('title3') + '=' + encodeURIComponent('운항'); /* */
    queryParams += '&' + encodeURIComponent('title4') + '=' + encodeURIComponent('항공권'); /* */
    queryParams += '&' + encodeURIComponent('title5') + '=' + encodeURIComponent('격리'); /* */

    // queryParams =  urlencode.encode(queryParams);

    request({
        url: url + queryParams,
        method: 'GET'
    }, (error, response, body) => {
        
        var data = convert.xml2json(body);
        data = JSON.parse(data);

        var list = data.elements[0].elements[1].elements[0].elements;    
        
        list.forEach(item => {
            console.log('ID: ' + item.elements[4].elements[0].text);
            console.log('COUNTRY: ' + item.elements[2].elements[0].text + '(' + item.elements[1].elements[0].text + ')');
            console.log('TITLE: ' + item.elements[5].elements[0].text);
            console.log('CONTENT: ' + item.elements[0].elements[0].text);
            console.log('DATE: ' + item.elements[6].elements[0].text);
            console.log('\n');
        });
    });

    res.render('coronaInfo');
});

module.exports = router;