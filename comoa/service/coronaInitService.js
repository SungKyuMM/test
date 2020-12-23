const request = require('request');
const convert = require('xml-js');
const safetyNews = require('../mongoDB/safetyNewsMongo');
const infectionStatus = require('../mongoDB/infectionStatusMongo');
const ageGenderStatus = require('../mongoDB/ageGenderStatusMongo');
const cityStatus = require('../mongoDB/cityStatusMongo');
const overseaOutBreak = require('../mongoDB/overseaOutBreakMongo');
const smsMongo = require('../mongoDB/smsMongo');
const { json } = require('express');

// 오늘 날짜 저장
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

    // 기본 몽고DB 입력 데이터
    var data = {};

    // 현 몽고 DB 데이터 확인
    let safety = await safetyNews.findOne(data);
    let infec = await infectionStatus.findOne(data);
    let ageGender = await ageGenderStatus.findOne(data);
    let city = await cityStatus.findOne(data);
    let over = await overseaOutBreak.findOne(data);
    let sms = await smsMongo.findOne(data);
    
    
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
        
        request({                                   // api 연결
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
                
            var jsonBody = convert.xml2json(body);  // api의 XML 데이터 json 변환
            jsonBody = JSON.parse(jsonBody);        // json parse
    
            // api 데이터 필요 데이터 부분 추출
            var list = jsonBody.elements[0].elements[1].elements[0].elements;
            
            if(list) {                              // 데이터가 존재 하는지 확인
                list.forEach(item => {
    
                    let data = new Object();        // 리스트 저장용 Object
                    data.id = item.elements[4].elements[0].text.trim();
                    data.country = item.elements[2].elements[0].text + '(' + item.elements[1].elements[0].text + ')';
                    data.title = item.elements[5].elements[0].text;
                    data.content = item.elements[0].elements[0].text;
                    data.create_dt = item.elements[6].elements[0].text;
                        
                    // json 데이터 변환
                    var jsonData = JSON.stringify(data);
                    jsonData = JSON.parse(jsonData);    

                    // 저장
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
    
            let i = 0;

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
    
                    if(i > 0){
                        let now = data.create_dt.substring(0, 10);
                        let prev = listData[i-1].create_dt.substring(0, 10)

                        if(now != prev) {
                            listData.push(data);  
                            i++;
                        }
                    } else {
                        listData.push(data);                                      
                        i++;
                    }
                });
   
                var jsonData = JSON.stringify(listData);
                jsonData = JSON.parse(jsonData);

                let msg = 'InfectionStatus MongoDB Success!';
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




    // 긴급재난문자 초기화
    if(sms == null) {
        console.log('::::: 긴급재난문자 초기화 :::::');
        var url = 'http://apis.data.go.kr/1741000/DisasterMsg2/getDisasterMsgList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=TPBNqjiytIA27IhRh7i4vjv6ezbtaOBtKP%2Fbs3VHwL2%2FkgMkmuNDPY50qFbpHr3oSVWlxg3r9BUhXW2Xpyh1Ew%3D%3D';
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /* 1번 page */
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000'); /* page당 row count)
        queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); /* xml, json 제공*/
        queryParams += '&' + encodeURIComponent('flag') + '=' + encodeURIComponent('Y'); /* 신규api 여부*/
        
        request({
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
            
            var listData = new Array();
    
            var jsonBody = (body);
            jsonBody = JSON.parse(jsonBody); //console.log('jsonbody => ' + jsonBody);
            var list = jsonBody.DisasterMsg[1].row; //console.log('list => ' + list[0].location_name);
            if(list) {
                for ( var i=0; i<list.length; i++){
                    listData.push(list[i]);
                }
                var jsonData = JSON.stringify(listData); //console.log('::: str result =>' + jsonData);
                jsonData = JSON.parse(jsonData); //console.log('::: data result =>' + jsonData);
                smsMongo.insertMany(jsonData); 
            }
        });
    }
}