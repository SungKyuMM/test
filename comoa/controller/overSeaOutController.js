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
        
        let now = year + '-' + month + '-' + day;
        let data = {create_dt: {$gte: new Date(now)}};

        let world = await overSeaOutMongo.find(data);
        let worldData = await codeService(world);

        res.render('testWorld', {worldData: worldData});
    }
}