const request = require('request');
const convert = require('xml-js');
const schedule = require('node-schedule');
const smsMongo = require('../mongoDB/smsMongo');
const { json } = require('express');

module.exports = (key, cron) => {      
    
    schedule.scheduleJob(cron, async () => {
        console.log('::::: 긴급재난문자 스케줄 START :::::' + new Date());
        let sort = {md101_sn: -1};
        let safety = await smsMongo.findOne(sort);
        
        var url = 'http://apis.data.go.kr/1741000/DisasterMsg2/getDisasterMsgList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + key;
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000');
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
            try {
                // JSON 리턴 받은 것중 실제 SMS Data는 row안에 있다. 
                var list = jsonBody.DisasterMsg[1].row;    
                if(list) {
                    for ( var i=0; i<list.length; i++){
                        let data = new Object();
                        // 데이터베이스에 마지막 데이터 고유넘버와 비교하여 최신 데이터만 배열에 넣는다.
                        if(safety.md101_sn < list[i].md101_sn){
                            listData.push(list[i]);
                            //console.log('list up sms md101_sn : ' + list[i].md101_sn);
                        }
                    }
                    var jsonData = JSON.stringify(listData);
                    jsonData = JSON.parse(jsonData);    
                    smsMongo.insertMany(jsonData);
                }
            } catch(e){
                console.log(e);
            }
        });
    });
    

}