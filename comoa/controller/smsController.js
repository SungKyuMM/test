const smsMongo = require('../mongoDB/smsStatusMongo');
const request = require('request');
const convert = require('xml-js');
const axios = require("axios");
const cheerio = require("cheerio");
const url = "http://ncov.mohw.go.kr/";
// 재 확진환자 의 현황 : (누적)48,570(누적)전일대비 (+ 1053)
// 현재 격리해제 의 현황 : 34,334(+ 352)
// 현재 치료 중(격리 중) 의 현황 : (격리 중)13,577(+ 687)
// 현재 사망 의 현황 : 659(+ 14)
const log = console.log;

module.exports = {
    todaySmsInfo: async (req, res, next) => {
        let resultArr = [];
        /*
        const getData = async () => {
            try{
                return await axios.get(url)
            }catch(error){
                log(err)
            }
        }
        */
        /*
        await getData().then(html => {
            const $ = cheerio.load(html.data);
            let parentTag = $("div.liveNum ul.liveNum li");
            
            parentTag.each(function(i, elem){
                let itemObj = { 
                    _text : $(this).find("strong").text(), 
                    _num :$(this).find("span").text()
                }
                resultArr.push(itemObj);
            })
            resultArr.forEach(elem => {
                log(`현재 ${elem._text}의 현황 : ${elem._num}`);
            })
        })
        */
    return new Promise(resolve => {
        
        var url = 'http://apis.data.go.kr/1741000/DisasterMsg2/getDisasterMsgList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=TPBNqjiytIA27IhRh7i4vjv6ezbtaOBtKP%2Fbs3VHwL2%2FkgMkmuNDPY50qFbpHr3oSVWlxg3r9BUhXW2Xpyh1Ew%3D%3D';
        queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
        queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('3');
        queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('xml'); /* */
        queryParams += '&' + encodeURIComponent('flag') + '=' + encodeURIComponent('Y'); /* */
        
     /*  
        request({
            url: url + queryParams,
            method: 'GET'
        },  (err, response, body) => {
            if(err) throw err;
            
            //var jsonBody = convert.xml2json(body);
            //jsonBody = JSON.parse(jsonBody);
   
            var list = jsonBody.elements[1];    

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
            //console.log('SafetyNews MongoDB Success!');
            //}
            var jsonData = JSON.stringify(listData);
            jsonData = JSON.parse(jsonData);

            
       });
       */
      var arr = {
        "DisasterMsg": [
            {
                "head": [
                    {
                        "totalCount": 55369
                    },
                    {
                        "numOfRows": "10",
                        "pageNo": "1",
                        "type": "JSON"
                    },
                    {
                        "RESULT": {
                            "resultCode": "INFO-0",
                            "resultMsg": "정상"
                        }
                    }
                ]
            },
            {
                "row": [
                    {
                        "create_date": "2020/12/21 20:20:12",
                        "location_id": "87",
                        "location_name": "경상북도 영양군",
                        "md101_sn": "75873",
                        "msg": "[영양군청]안동소방서 관련 지역접촉자4명, 영양 3번째 확진자 접촉자9명 전원 음성. 연말모임·식사·타지외출 자제, 생활속 거리두기 등 방역수칙 준수 바랍니다.",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 20:15:07",
                        "location_id": "20",
                        "location_name": "강원도 횡성군",
                        "md101_sn": "75872",
                        "msg": "[횡성군청]횡성확진자와 관련한 검사중 4명 모두 음성입니다/방역수칙 준수와 연말모임, 외출을 자제하여 주시기 바랍니다.",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 20:13:08",
                        "location_id": "5",
                        "location_name": "강원도 동해시",
                        "md101_sn": "75871",
                        "msg": "[동해시청] 학생 확진자 관련자/감기 등 유증상자들께서는 검사결과가 나올때까지 외출을 자제하시기 바라며, 선별진료시 거리두기 등 방역수칙을 지켜주시기 바랍니다.",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 20:09:56",
                        "location_id": "147",
                        "location_name": "서울특별시 동대문구",
                        "md101_sn": "75870",
                        "msg": "[동대문구청]527~537번 확진자발생, ddm4you.blog.me 참조하시고, 연말연시 각종모임과 회식을 멈추어주세요. 모두가 멈춰야 코로나도 멈출수 있습니다",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 20:09:17",
                        "location_id": "204",
                        "location_name": "전라북도 군산시",
                        "md101_sn": "75869",
                        "msg": "[군산시청] <군산 118번 확진자 발생> ▲수원 636번 접촉자 ▲역학조사 및 이동동선 파악 중 ▲외출 및 모임자제 바랍니다.(063-463-4000)",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 20:05:12",
                        "location_id": "29",
                        "location_name": "경기도 김포시",
                        "md101_sn": "75868",
                        "msg": "[김포시청] 김포골드라인 차량 고장으로 상하행 전 차선 운행중단 중 입니다. 골드라인 이용객은 다른 교통수단을 이용바랍니다. 조속히 복구하겠습니다.",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 20:04:04",
                        "location_id": "38",
                        "location_name": "경기도 안양시",
                        "md101_sn": "75867",
                        "msg": "[안양시청] 안양 590~595번 확진자 발생 blog.anyang.go.kr/222180914555 동선 등 추가정보는 지속적으로 업데이트 예정.",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 19:57:40",
                        "location_id": "217",
                        "location_name": "제주특별자치도 전체",
                        "md101_sn": "75866",
                        "msg": "[제주도] 7080라이브카페 2~6층(서해안로648), 일도1동 77다방,조천읍 혼모심사우나 남탕 방문자검사당부 covid19.jeju.go.kr/info.jsp",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 19:34:08",
                        "location_id": "35",
                        "location_name": "경기도 시흥시",
                        "md101_sn": "75865",
                        "msg": "[시흥시청] 확진자 1명발생(신천동), 276접촉, 자가격리 후 검사에서 확진, 역학조사중 blog.naver.com/siheungblog/222181006251",
                        "send_platform": "cbs"
                    },
                    {
                        "create_date": "2020/12/21 19:33:45",
                        "location_id": "119",
                        "location_name": "부산광역시 전체",
                        "md101_sn": "75864",
                        "msg": "[부산시]12.12.(토) 17:40~20:47 27번가 그집(연제구 쌍미천로 161번길 27)에서 식사한 분 연제구보건소로 상담바랍니다.(소독완료)",
                        "send_platform": "cbs"
                    }
                ]
            }
        ]
    };
    
                        console.log(arr.DisasterMsg[1].row);
        res.render('ncovSMS', {sms:arr.DisasterMsg[1].row});
    });
    }
        
}