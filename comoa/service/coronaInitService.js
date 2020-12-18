const request = require('request');
const convert = require('xml-js');
const safetyNews = require('../mongoDB/safetyNewsMongo');
const infectionStatus = require('../mongoDB/infectionStatusMongo');
const ageGenderStatus = require('../mongoDB/ageGenderStatusMongo');
const cityStatus = require('../mongoDB/cityStatusMongo');
const overseaOutBreak = require('../mongoDB/overseaOutBreakMongo');
const { json } = require('express');

let date = new Date();
let year = date.getFullYear() + '';
let month = (date.getMonth() + 1) + '';
let day = date.getDate();

if(day < 10) {
    day += '';
    day = '0' + day;
}
let end = year + month + day;

module.exports = async (key) => {    

    var data = {};
    let safety = await safetyNews.findOne(data);
    let infec = await infectionStatus.findOne(data);
    let ageGender = await ageGenderStatus.findOne(data);
    let city = await cityStatus.findOne(data);
    let over = await overseaOutBreak.findOne(data);
    
    
    // 국가·지역별 최신안전소식(코로나관련) DB 초기화
    if(safety == null) {
        var url = 'http://apis.data.go.kr/1262000/SafetyNewsList/getCountrySafetyNewsList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('120');
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
                
            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);
    
            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
            
            if(list) {
                list.forEach(item => {
    
                    let data = new Object();
                    data.id = item.elements[4].elements[0].text.trim();
                    data.country = item.elements[2].elements[0].text + '(' + item.elements[1].elements[0].text + ')';
                    data.title = item.elements[5].elements[0].text;
                    data.content = item.elements[0].elements[0].text;
                    data.create_dt = item.elements[6].elements[0].text;
                        
                    var jsonData = JSON.stringify(data);
                    jsonData = JSON.parse(jsonData);    

                    safetyNews.updateMany(jsonData);
                });
            
                console.log('SafetyNews MongoDB Success!');
            }
        });
    }    
    

    // 코로나19 감염 현황 DB 초기화
    if(infec == null) {
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20201001');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(end);
    
        request({
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
            
            var listData = new Array();
    
            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);
    
            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
    
            if(list) {
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
    
                let msg = 'SafetyNews MongoDB Success!';
                infectionStatus.insertMany(jsonData, msg);
            }
        });
    }
    

    // 코로나19 연령, 성별감염 상황 DB 초기화
    if(ageGender == null) {
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19GenAgeCaseInfJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20201001');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(end);
    
        request({
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
            
            var listData = new Array();
    
            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);
    
            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
            
            if(list) {
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
               
                let msg = 'AgeGenderStatus MongoDB Success!';
                ageGenderStatus.insertMany(jsonData, msg);
            }
        });
    }
    

    // 코로나19 시·도발생 현황 DB 초기화
    if(city == null) {
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20201001');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(end);
    
        request({
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
            
            var listData = new Array();
    
            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);
    
            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
            
            if(list) {
    
                list.forEach(item => {      
                    if(item.elements[14].elements[0].text == 'null') {
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
                    }
                });
        
                var jsonData = JSON.stringify(listData);
                jsonData = JSON.parse(jsonData);
    
                let msg = 'CityStatus MongoDB Success!';
                cityStatus.insertMany(jsonData, msg); 
            }
        });
    }
    
    
    // 코로나19 해외발생 현황 DB 초기화
    if(over == null) {        
        var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20201001');
        queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(end);
    
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (err, response, body) {
            if(err) throw err;
            
            var jsonBody = convert.xml2json(body);
            jsonBody = JSON.parse(jsonBody);
    
            var list = jsonBody.elements[0].elements[1].elements[0].elements;    
    
            if(list) {
                list.forEach(item => {                            
                    let data = new Object();
    
                    data.area_nm = item.elements[0].elements[0].text;
                    data.create_dt = item.elements[3].elements[0].text;
                    data.nat_death_cnt = item.elements[4].elements[0].text * 1;
                    data.nat_death_rate = item.elements[5].elements[0].text * 1;
                    data.nat_def_cnt = item.elements[6].elements[0].text * 1;
                    data.nation_nm = item.elements[7].elements[0].text;
                    data.seq = item.elements[10].elements[0].text * 1;
        
                    var jsonData = JSON.stringify(data);
                    jsonData = JSON.parse(jsonData);    
    
                    // API의 자체 중복 데이터로 인한 DB저장
                    overseaOutBreak.updateMany(jsonData);
                });              
                
                console.log('OverseaOutbreak MongoDB Success!');
            }
        });
    }

}