const cityMongo = require('../mongoDB/cityStatusMongo');

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
        let data = {create_dt: {$gte: now}};

        let city = await cityMongo.findMany(data);

        res.render('testCity', {city: city});
    }
};

