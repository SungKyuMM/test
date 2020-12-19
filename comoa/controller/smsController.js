const smsMongo = require('../mongoDB/smsStatusMongo');

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
        res.render('ncovSMS', {sms:resultArr});
    }
        
}