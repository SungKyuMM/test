var request = require('request');
var convert = require('xml-js');

var services = {};

const key = 'service key';

services.safetyNews = async () => {
    return new Promise(resolve => {
        var url = 'http://apis.data.go.kr/1262000/SafetyNewsList/getCountrySafetyNewsList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('title1') + '=' + encodeURIComponent('입국');
        queryParams += '&' + encodeURIComponent('title2') + '=' + encodeURIComponent('코로나');
        queryParams += '&' + encodeURIComponent('title3') + '=' + encodeURIComponent('운항');
        queryParams += '&' + encodeURIComponent('title4') + '=' + encodeURIComponent('항공권');
        queryParams += '&' + encodeURIComponent('title5') + '=' + encodeURIComponent('격리');

        request({
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
            
            var listData = new Array();

            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);

            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
            
            list.forEach(item => {

                let data = new Object();
                data.id = item.elements[4].elements[0].text.trim();
                data.country = item.elements[2].elements[0].text + '(' + item.elements[1].elements[0].text + ')';
                data.title = item.elements[5].elements[0].text;
                data.content = item.elements[0].elements[0].text;
                data.date = item.elements[6].elements[0].text;

                listData.push(data);
            });

            var jsonData = JSON.stringify(listData);
            jsonData = JSON.parse(jsonData);

            resolve(jsonData);
        });
    });
};


services.infectionStatus = async () => {
    return new Promise(resolve => {
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1) + '';
        let day = date.getDay();

        if(day < 10) {
            day += '';
            day = '0' + day;
        }
        let createDt = year + month + day;

        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20201101');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(createDt);

        request({
            url: url + queryParams,
            method: 'GET'
        }, function (err, response, body) {
            if(err) throw err;
            
            var listData = new Array();

            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);

            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
            
            list.forEach(item => {

                let data = new Object();
                data.create_dt = item.elements[5].elements[0].text;
                data.acc_def_rate = item.elements[0].elements[0].text * 1;
                data.acc_exam_cnt = item.elements[1].elements[0].text * 1;
                data.acc_exam_comp_cnt = item.elements[2].elements[0].text * 1;
                data.care_cnt = item.elements[3].elements[0].text * 1;
                data.clear_cnt = item.elements[4].elements[0].text * 1;
                data.death_cnt = item.elements[6].elements[0].text * 1;
                data.decide_cnt = item.elements[7].elements[0].text * 1;
                data.exam_cnt = item.elements[8].elements[0].text * 1;
                data.result_neg_cnt = item.elements[9].elements[0].text * 1;
                data.seq = item.elements[10].elements[0].text * 1;

                listData.push(data);
            });

            var jsonData = JSON.stringify(listData);
            jsonData = JSON.parse(jsonData);
            
            resolve(jsonData);
        });
    });
}

module.exports = services;