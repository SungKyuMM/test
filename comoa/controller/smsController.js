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
        let sql = {};
        let count = 0;
        let location_name = req.query.location_name;

        if(location_name!=''){
            sql['search'] = {
                location_name: { $regex : location_name }
            };
        }

        count = await smsMongo.count(sql.search); 
        console.log('total : ' +count);

        let nowPage = req.query.startPage;
        let lastPageNum = parseInt(count / 30);
        
        if(count % 30 != 0) lastPageNum += 1;

        if(nowPage > 1) start = true;
        if(lastPageNum > 1) end = true;
        if(lastPageNum == nowPage) end = false;

        let data = {
            search: sql.search ,
            sort: -1,
            maxPage: 30,
            startPage: (nowPage-1) * 30
        };
        let post = await smsMongo.smsPaging(data);
        res.render('ncovSMS', {post: post, nowPage: nowPage, lastPageNum: lastPageNum, location_name:location_name});
        
    },

    searchSMS: async (req, res, next) => {
        //console.log('긴급재난문자 검색 loop');
        let lnm = req.body.location_name;
        let data = {
            location_name: {
                $regex : lnm
            }
        }
        //console.log('검색지역 ====> ' + data.location_name); 
        let count = await smsMongo.count(data);
        //let count = await smsMongo.count({location_name:/경기/});
        
        //console.log('검색 레코드 수 ==> ' + count);

        let lastPageNum = parseInt(count / 30);

        if(count % 30 != 0) lastPageNum += 1;

        let paginData = {
            search: data,
            sort: -1,
            maxPage: 30,
            startPage: 0
        };

        let result = await smsMongo.smsPaging(paginData);
        //console.log('결과 ==> ' + result);
        //console.log('lnm =>'+lnm);
        res.json({list: result, lastPageNum: lastPageNum, location_name: lnm});
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