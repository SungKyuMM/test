const infectionMongo = require('../mongoDB/infectionStatusMongo');

module.exports = {
    infectionGraph: async (req, res, next) => {
        let data = {create_dt: {$gte: new Date("2020-11-01")}};
        let infectionData = await infectionMongo.find(data);        
        res.render('t2', {infectionData: infectionData});
    }
}