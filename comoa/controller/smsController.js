const smsMongo = require('../mongoDB/smsMongo');
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
    smsInfo : async (req, res, next) => {
        let count = await smsMongo.allCount();  
        let start = false;
        let end = false;
        let nowPage = req.query.startPage;
        let lastPageNum = parseInt(count / 10);
                
        if(count % 10 != 0) lastPageNum += 1;

        if(nowPage > 1) start = true;
        if(lastPageNum > 1) end = true;
        if(lastPageNum == nowPage) end = false;

        let data = {
            sort: -1,
            maxPage: 90,
            startPage: (nowPage-1) * 10
        };
        console.log('total : ' +count);
        let post = await smsMongo.paging(data);
        res.render('ncovSMS', {post: post, nowPage: nowPage, start: start, end: end, lastPageNum: lastPageNum});
        
    },
    todaySmsInfo : async (req, res, next) => {
        let resultArr = [];
        /* 코로나 상황판 크롤링*/
        const getData = async () => {
            try{
                return await axios.get(url)
            }catch(error){
                log(err)
            }
        }
        
        
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
        
        // console.log(arr.DisasterMsg[1].row);
        res.render('ncovCrawling', {sms:resultArr});
   
    }
        
}