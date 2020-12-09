const request = require('request');
const convert = require('xml-js');
const schedule = require('node-schedule');
const safetyNews = require('../mongoDB/safetyNewsMongo');
const infectionStatus = require('../mongoDB/infectionStatusMongo');
const ageGenderStatus = require('../mongoDB/ageGenderStatusMongo');
const cityStatus = require('../mongoDB/cityStatusMongo');
const overseaOutBreak = require('../mongoDB/overseaOutBreakMongo');
const { json } = require('express');

module.exports = (key, cron) => {      
    let date = new Date();
    let year = date.getFullYear() + '';
    let month = (date.getMonth() + 1) + '';
    let day = date.getDate();
    
    if(day < 10) {
        day += '';
        day = '0' + day;
    }
    let now = year + month + day;
    let mongoNow = year + '-' + month + '-' + day;
    let data = {create_dt: {$gte: new Date(mongoNow)}};
    
    schedule.scheduleJob(cron, async () => {
        let safety = await safetyNews.findOne(data);
        if(safety == null) {
            var url = 'http://apis.data.go.kr/1262000/SafetyNewsList/getCountrySafetyNewsList';
            var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1');
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
                
                if(list) {
                    list.forEach(item => {

                        let data = new Object();
                        data.id = item.elements[4].elements[0].text.trim();
                        data.country = item.elements[2].elements[0].text + '(' + item.elements[1].elements[0].text + ')';
                        data.title = item.elements[5].elements[0].text;
                        data.content = item.elements[0].elements[0].text;
                        data.create_dt = item.elements[6].elements[0].text;

                        listData.push(data);
                    });
                
                    var jsonData = JSON.stringify(listData);
                    jsonData = JSON.parse(jsonData);    

                    safetyNews.insertMany(jsonData);
                }
            });
        }
    });
    
    
    schedule.scheduleJob(cron, async () => {    
        let infec = await infectionStatus.findOne(data);

        if(infec == null) {
            var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson';
            var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
            queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(now);
            queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(now);
        
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
        
        
                    infectionStatus.insertMany(jsonData);
                }
            });  
        }
    });

    schedule.scheduleJob(cron, async () => {    
        let ageGender = await ageGenderStatus.findOne(data);    

        if(ageGender == null) {
            var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19GenAgeCaseInfJson';
            var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
            queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(now);
            queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(now);
        
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
                   
                    ageGenderStatus.insertMany(jsonData);
                }
            });   
        }
    });


    schedule.scheduleJob(cron, async () => {    
        let city = await cityStatus.findOne(data);
    
        if(city == null) {
            var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson';
            var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
            queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(now);
            queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(now);
        
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
        
                    cityStatus.insertMany(jsonData); 
                }
            });
        }
    });


    schedule.scheduleJob(cron, async () => {
        let over = await overseaOutBreak.findOne(data); 

        if(over == null) {
            var url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19NatInfStateJson';
            var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
            queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
            queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
            queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent(now);
            queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent(now);
        
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
                    
                    
                    console.log('OverseaOutbreak Init MongoDB Success!');
                }
            });
        }
    });

}