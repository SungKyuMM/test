const { concatLimit } = require('async');
const { json } = require('express');
const { MongooseDocument } = require('mongoose');
const infectionMongo = require('../mongoDB/infectionStatusMongo');








module.exports = {
    infectionGraph: async (req, res, next) => {
        let data = {create_dt: {$gte: new Date("2020-11-01")}};
        let infectionData = await infectionMongo.find(data);        

        var today = { 
            'Kodecide_cnt' : infectionData[0].decide_cnt -  infectionData[1].decide_cnt,
            'KoEXAM_CNT' : infectionData[0].exam_cnt -  infectionData[1].exam_cnt,
            'KoCLEAR_CNT' : infectionData[0].clear_cnt -  infectionData[1].clear_cnt,
        };

        var KoList = new Array();
        var dateList = new Array();
        for(var i =30; i>=0; i--)
        {
             var tempDate = new Object();
             tempDate.meta =  new Date(infectionData[i].create_dt).toISOString().split("T")[0];
             tempDate.value = infectionData[i].decide_cnt - infectionData[i+1].decide_cnt;
             KoList.push(tempDate);
             dateList.push( tempDate.meta.substring(5));
        }
        console.log(dateList);


        res.render('index', {infectionData: infectionData, today : today, KoList : KoList, dateList : dateList});
    }, 

    showInfection: async (req, res, next) => {
        let data = {};
        let infection = await infectionMongo.sortFind(data);
        res.end()

    }
}