const ageGenderMongo = require('../mongoDB/ageGenderStatusMongo');

module.exports = {
    todayInfo: async (req, res, next) => {
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

        let ageGender = await ageGenderMongo.findMany(data);
        
        if(Object.keys(ageGender).length == 0) {
            let yesterDate = now.getTime() - (1 * 24 * 60 * 60 * 1000);
            now.setTime(yesterDate);
            
            data = {create_dt: {$gte: now}};
            ageGender = await ageGenderMongo.findMany(data);
        }

        res.render('testAgeGender', {ageGender: ageGender});
    }
}