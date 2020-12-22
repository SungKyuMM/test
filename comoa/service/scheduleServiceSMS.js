const request = require('request');
const convert = require('xml-js');
const schedule = require('node-schedule');
const smsMongo = require('../mongoDB/smsMongo');
const { json } = require('express');

module.exports = (key, cron) => {      
    
    schedule.scheduleJob(cron, async () => {
        console.log('::::: sms 스케줄 start :::::');
        let sort = {md101_sn: -1};
        let safety = await smsMongo.findOne(sort);
        
        var url = 'http://apis.data.go.kr/1741000/DisasterMsg2/getDisasterMsgList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10');
        queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json'); /* */
        queryParams += '&' + encodeURIComponent('flag') + '=' + encodeURIComponent('Y'); /* */
        
        request({
            url: url + queryParams,
            method: 'GET'
        }, (err, response, body) => {
            if(err) throw err;
            
            var listData = new Array();

            var jsonBody = (body);
            jsonBody = JSON.parse(jsonBody);
            //console.log('jsonbody => ' + jsonBody);
            var list = jsonBody.DisasterMsg[1].row;    
            //console.log('list => ' + list[0].location_name);
            if(list) {
                for ( var i=0; i<list.length; i++){
                    let data = new Object();
                    /*
                    data.create_date = list[i].create_date;
                    data.location_id = list[i].location_id;
                    data.location_name = list[i].location_name;
                    data.md101_sn = list[i].md101_sn;
                    data.msg = list[i].msg;
                    data.send_platform = list[i].send_platform;
                    */
                    listData.push(list[i]);
                    //listData.push(data);
                }
                var jsonData = JSON.stringify(listData);
                jsonData = JSON.parse(jsonData);    

                // 중복 검사 
                if(safety[0].md101_sn < jsonData[0].md101_sn)
                    smsMongo.insertMany(jsonData);
            }
        });
    });
    

}