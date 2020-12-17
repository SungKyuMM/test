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
        let age = new Array;
        for(let i = 0; i < 9; i++) {
            age.push(ageGender[i]);
        }
        let female = ageGender[9];
        let male = ageGender[10];
        console.log(age);

        res.render('testAgeGender', {ageGender: ageGender});
    }
}