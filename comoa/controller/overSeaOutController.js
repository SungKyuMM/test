const overSeaOutMongo = require('../mongoDB/overseaOutBreakMongo');
const codeService = require('../service/worldCodeService');

module.exports = {
    worldStatus: async (req, res, next) => {        
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1) + '';
        let day = date.getDate();

        if(day < 10) {
            day += '';
            day = '0' + day;
        }
        
        let now = new Date(year + '-' + month + '-' + day);        
        let data = {create_dt: {$gte: now}};

        let world = await overSeaOutMongo.find(data);
        
        // 최신 날짜 데이터가 API에 없는 경우 전날 데이터 불러오기
        if(Object.keys(world).length == 0) {
            let yesterDate = now.getTime() - (1 * 24 * 60 * 60 * 1000);
            now.setTime(yesterDate);
            
            data = {create_dt: {$gte: now}};
            world = await overSeaOutMongo.find(data);
        }        

        let codeData = await codeService(world);
        let worldData = codeData['world'];
        let covidData = codeData['covid'];

        res.render('testWorld', {worldData: worldData, covidData: covidData});
    }
}