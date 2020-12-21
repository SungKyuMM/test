const { concatLimit } = require('async');
const { json } = require('express');
const { MongooseDocument } = require('mongoose');
const infectionMongo = require('../mongoDB/infectionStatusMongo');
const overSeaMongo = require('../mongoDB/overseaOutBreakMongo');
const cityMongo = require('../mongoDB/cityStatusMongo');


module.exports = {
    infectionGraph: async (req, res, next) => {
        let data = {create_dt: {$gte: new Date("2020-11-01")}};
        let infectionData = await infectionMongo.find(data); 
        
        let data2 = [
            {
                '$project' : 
                {
                    '_id' : 0,
                    'nat_def_cnt' : 1,
                    'nat_death_cnt':1,
                    'day_' : { $dateToString: { format: "%Y-%m-%d", date: "$create_dt" } },
                }
            },
            {$group : 
                {
                    '_id' : '$day_',                  
                   decide_total : 
                    {
                            $sum : "$nat_def_cnt"
                    },
                    death_total:
                    {
                        $sum : "$nat_death_cnt"
                    },
                }
            },
            {$sort :
                {
                       _id : -1
                }
            },
            {
                $limit : 32
            }
        ]
        let overSeaData = await overSeaMongo.finday(data2);

        let data3 = [
            {
                $match : { gubun : '합계'}
         },
         {  
             '$project' : 
             {
                 '_id' : 0,
                 'inc_dec' : 1,
                 'local_occ_cnt':1,
                 'over_flow_cnt' : 1,
                 'death_cnt':1,           
                'def_cnt' : 1,
                'isol_clear_cnt' : 1,
                 'day_' : { $dateToString: { format: "%Y-%m-%d", date: "$create_dt" } },
             }
         },
         {$sort :
             {
                day_ : -1
             }
         },
         {
             $limit : 32
         }
        ]
        let cityData = await cityMongo.finday(data3);
       
        var today = { 
            'Kodecide_cnt' : infectionData[0].decide_cnt -  infectionData[1].decide_cnt,    // 확진자 수
            'KoEXAM_CNT' : infectionData[0].exam_cnt -  infectionData[1].exam_cnt,          // 검사 진행 수
            'KoCLEAR_CNT' : infectionData[0].clear_cnt -  infectionData[1].clear_cnt,       // 격리 해제 수
            'outTodayDecide_cnt' : overSeaData[0].decide_total - overSeaData[1].decide_total, // 확진자 수 토탈
            'outTodaydeath_cnt' : overSeaData[0].death_total - overSeaData[1].death_total,  // 사망자 수 토탈
            'outDecide_cnt' : overSeaData[0].decide_total,

            
            // 코로나 확진자 격리해제율 구하는 용도
            'Kodecide_cnt_Total' : infectionData[0].decide_cnt,
            'KoEXAM_CNT_Total' : infectionData[0].exam_cnt,
            'KoCLEAR_CNT_Total' : infectionData[0].clear_cnt
        };
        console.log(today);

        var KoList = new Array();
        var outSeaList = new Array();
        var dateList = new Array();
        for(var i =30; i>=0; i--)
        {

            var t1 = new Date(infectionData[i].create_dt).toISOString().split("T")[0];
            var t2 = new Date(infectionData[i+1].create_dt).toISOString().split("T")[0];
            var t3 = infectionData[i].decide_cnt - infectionData[i+1].decide_cnt;
            if( t1 != t2 && t3 > 1) 
            {
            var tempDate = new Object();
            tempDate.meta =  t1;
            tempDate.value = t3;
            KoList.push(tempDate);
            dateList.push( tempDate.meta.substring(5));
            }
            
            // if(overSeaData[i]._id == '2020-12-17' || overSeaData[i]._id =='2020-12-16')
            //     continue;
            var t1 = overSeaData[i].decide_total - overSeaData[i+1].decide_total;
            if(t1 > 2000 && t1 < 10000000 ){
            var tempDate2 = new Object();
            tempDate2.meta =  overSeaData[i]._id;
            tempDate2.value = overSeaData[i].decide_total - overSeaData[i+1].decide_total;
            outSeaList.push(tempDate2);
            }
        }
        
        //console.log(outSeaList);  

        res.render('index', {infectionData: infectionData, today : today, KoList : KoList, dateList : dateList, outSeaList : outSeaList });
    }, 

    showInfection: async (req, res, next) => {
        let data = {};
        let infection = await infectionMongo.sortFind(data);
        res.end()

    }
}