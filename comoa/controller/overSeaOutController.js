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
    },

    showOverseaout: async (req, res, next) => {
        let data = {};
        let count = 0;

        let startTime = req.query.startTime;
        let endTime = req.query.endTime;
        let area_nm = req.query.area;
        let nation_nm = req.query.nation;
        
        if(startTime != '') {
            data['create_dt'] = {
                    $gte: new Date(startTime), 
                    $lte: new Date(endTime + "T23:59:59")
                }
        }

        if(area_nm != '') data['area_nm'] = area_nm;
        if(nation_nm != '') data['nation_nm'] = nation_nm;

        count = await overSeaOutMongo.count(data);

        let start = false;
        let end = false;
        let nowPage = req.query.startPage;
        let lastPage = parseInt(count / 30);

        if(count % 30 != 0) lastPage += 1;

        if(nowPage > 1) start = true;
        if(lastPage > 1) end = true;
        if(lastPage == nowPage) end = false;

        let paginData = {
            search: data,
            sort: -1,
            maxPage: 30,
            startPage: (nowPage-1) * 30
        };

        let overseaout = await overSeaOutMongo.overseaoutPaging(paginData);
        let areaSelect = await overSeaOutMongo.overseaoutDistinct("area_nm");
        let nationSelect = await overSeaOutMongo.overseaoutDistinct("nation_nm");
        // for(var i = 0; i < areaSelect.length; i++)
        //     console.log(areaSelect[i])

        res.render('testoverseaout', {overseaout: overseaout, nowPage: nowPage, start: start, end: end, startTime: startTime, endTime: endTime, area: area_nm, nation: nation_nm, lastPage: lastPage, areaSelect: areaSelect, nationSelect: nationSelect});
    }, 

    areaGroup: async (req, res, next) => {
        let key = req.body.key;

        let data = {
            create_dt: { $gte: new Date("2020-12-20") }
        }

        if(key != 'null') data['area_nm'] = key;

        let result = await overSeaOutMongo.find(data);

        res.json({list: result});
    },

    searchOverSeaOut: async (req, res, next) => {
        let start = req.body.start;
        let end = req.body.end;
        let area = req.body.area;
        let nation = req.body.nation;

        let data = {
            create_dt: {
                $gte: new Date(start), 
                $lte: new Date(end + "T23:59:59")
            }
        }

        if(area != '') data['area_nm'] = area;
        if(nation != '') data['nation_nm'] = nation;

        let count = await overSeaOutMongo.count(data);

        let lastPage = parseInt(count / 30);

        if(count % 30 != 0) lastPage += 1;

        let paginData = {
            search: data,
            sort: -1,
            maxPage: 30,
            startPage: 0
        };

        let overseaout = await overSeaOutMongo.overseaoutPaging(paginData);

        res.json({list: overseaout, lastPage: lastPage});
    }
}