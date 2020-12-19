const infectionMongo = require('../mongoDB/infectionStatusMongo');

module.exports = {
    infectionGraph: async (req, res, next) => {
        let data = {create_dt: {$gte: new Date("2020-11-01")}};
        let infectionData = await infectionMongo.find(data);        
        
        res.render('t2', {infectionData: infectionData});
    }, 

    showInfection: async (req, res, next) => {

        let data = {};
        let count = 0;

        let startTime = req.query.startTime;
        let endTime = req.query.endTime;
        
        if(startTime != '') {
            data = {
                create_dt: {
                    $gte: new Date(startTime), 
                    $lte: new Date(endTime + "T23:59:59")
                }
            }
        }
                
        count = await infectionMongo.count(data);            
        let start = false;
        let end = false;
        let nowPage = req.query.startPage;
        let lastPageNum = parseInt(count / 10);

        if(count % 10 != 0) lastPageNum += 1;

        if(nowPage > 1) start = true;
        if(lastPageNum > 1) end = true;
        if(lastPageNum == nowPage) end = false;

        let paginData = {
            search: data,
            sort: -1,
            maxPage: 10,
            startPage: (nowPage-1) * 10
        };

        let infection = await infectionMongo.infectionPaging(paginData);

        res.render('testinfection', {infection: infection, nowPage: nowPage, start: start, end: end, startTime: startTime, endTime: endTime, lastPageNum: lastPageNum});
    },

    searchInfection: async (req, res, next) => {
        let start = req.body.start;
        let end = req.body.end;

        let data = {
            create_dt: {
                $gte: new Date(start), 
                $lte: new Date(end + "T23:59:59")
            }
        }

        let count = await infectionMongo.count(data);
        let lastPageNum = parseInt(count / 10);

        if(count % 10 != 0) lastPageNum += 1;

        let paginData = {
            search: data,
            sort: -1,
            maxPage: 10,
            startPage: 0
        };

        let infectionList = await infectionMongo.dateSearch(paginData);
        res.json({list: infectionList, lastPageNum: lastPageNum});
    }
}