var request = require('request');
var convert = require('xml-js');

var services = {};

const key = 'gS9%2Fg7TGU2ycNJmvCRBkL%2F%2FGW%2BO%2B2qLz64HxeAkRsfDkc7tddS8J7LufAm7qFTrlZl0D3cIPjHv2q7IASZHI3Q%3D%3D';

let date = new Date();
let year = date.getFullYear() + '';
let month = (date.getMonth() + 1) + '';
let day = date.getDate();

if(day < 10) {
    day += '';
    day = '0' + day;
}
let createDt = year + month + day;

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

        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20201101');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(createDt);

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
                data.acc_def_rate = item.elements[0].elements[0].text * 1;
                data.acc_exam_cnt = item.elements[1].elements[0].text * 1;
                data.acc_exam_comp_cnt = item.elements[2].elements[0].text * 1;
                data.care_cnt = item.elements[3].elements[0].text * 1;
                data.clear_cnt = item.elements[4].elements[0].text * 1;
                data.create_dt = item.elements[5].elements[0].text;
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


services.ageGenderStatus = async () =>{
    return new Promise(resolve => {
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19GenAgeCaseInfJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(createDt);
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(createDt);

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
                data.conf_case = item.elements[0].elements[0].text * 1;
                data.conf_case_rate = item.elements[1].elements[0].text * 1;                
                data.create_dt = item.elements[2].elements[0].text;
                data.critical_rate = item.elements[3].elements[0].text * 1;
                data.death = item.elements[4].elements[0].text * 1;
                data.death_rate = item.elements[5].elements[0].text * 1;
                data.gubun = item.elements[6].elements[0].text;
                data.seq = item.elements[7].elements[0].text * 1;

                listData.push(data);
            });

            var jsonData = JSON.stringify(listData);
            jsonData = JSON.parse(jsonData);
            
            resolve(jsonData);
        });
    });
};


services.cityStatus = async () => {
    return new Promise(resolve => {
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20200410');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(createDt);

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
                data.create_dt = item.elements[0].elements[0].text;
                data.death_cnt = item.elements[1].elements[0].text * 1;                
                data.def_cnt = item.elements[2].elements[0].text * 1;
                data.gubun = item.elements[3].elements[0].text;
                data.inc_dec = item.elements[6].elements[0].text * 1;
                data.isol_clear_cnt = item.elements[7].elements[0].text * 1;
                data.isoling_cnt = item.elements[8].elements[0].text * 1;
                data.local_occ_cnt = item.elements[9].elements[0].text * 1;
                data.over_flow_cnt = item.elements[10].elements[0].text * 1;
                data.qur_rate = item.elements[11].elements[0].text;
                data.seq = item.elements[12].elements[0].text * 1;

                listData.push(data);
            });

            var jsonData = JSON.stringify(listData);
            jsonData = JSON.parse(jsonData);
            console.log(jsonData);
            resolve(jsonData);
        });
    });
};


services.overseaOutbreak = () => {
    return new Promise(resolve => {
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(createDt);
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
                data.area_nm = item.elements[0].elements[0].text;
                data.create_dt = item.elements[3].elements[0].text;
                data.nat_death_cnt = item.elements[4].elements[0].text * 1;
                data.nat_death_rate = item.elements[5].elements[0].text * 1;
                data.nat_def_cnt = item.elements[6].elements[0].text * 1;
                data.nation_nm = item.elements[7].elements[0].text;
                data.seq = item.elements[10].elements[0].text * 1;

                listData.push(data);
            });

            var jsonData = JSON.stringify(listData);
            jsonData = JSON.parse(jsonData);
            
            resolve(jsonData);
        });
    });
};

module.exports = services;