const cityMongo = require('../mongoDB/cityStatusMongo');

const overSeaOutMongo = require('../mongoDB/overseaOutBreakMongo');
const codeService = require('../service/KoMapCodeService');


module.exports = {
    allInfo: async (req, res, next) => {
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1) + '';
        let day = date.getDate();

        if(day < 10) {
            day += '';
            day = '0' + day;
        }
        
        let now = new Date(year + '-' + month + '-' + day);
        //console.log(now); 
        let data = {create_dt: {$gte: new Date(now)}};

        let city = await cityMongo.findMany(data);

        res.render('ncovCity', {cityData: city});
    },


    ko: async (req, res, next) => {        
        let tempDateSql = [
            {
                '$project' : 
                {
                    '_id' : 0,
                    'day_' : { $dateToString: { format: "%Y-%m-%d", date: "$create_dt" } },
                }
            },
            {
                $sort : { day_ : -1 }
            },
            {
                $limit : 1
            },
        ]
        let tempDate = await cityMongo.finday(tempDateSql);
        let dataSql = [
            {
                '$match' : 
                 { 
                     'gubun' : {$nin : ['합계', '검역'] },
                     'create_dt' : {$gte : new Date(tempDate[0].day_) }
                 }
             },
             {
                 '$project' : 
                 {
                     '_id' : 0,
                     'inc_dec' : 1,
                     'def_cnt' : 1,
                     'death_cnt' : 1,
                     'gubun' : 1,
                     'isol_clear_cnt' : 1,
                     'isoling_cnt' : 1,
                     'over_flow_cnt' : 1,
                     'local_occ_cnt' : 1,
                     'day_' : { $dateToString: { format: "%Y-%m-%d", date: "$create_dt" } },
                 }
             },
             {
                 $sort : { day_ : -1 }
             },
        ]
        let data = await cityMongo.finday(dataSql);

        let codeData = await codeService(data);
        let worldData = codeData['world'];
        let covidData = codeData['covid'];
        res.render('korea', {worldData: worldData, covidData : covidData});
    },


};

