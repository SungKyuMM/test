const ageGenderMongo = require('../mongoDB/ageGenderStatusMongo');

module.exports = {
    // 나이 성별 코로나 정보
    todayInfo: async (req, res, next) => {

        // 오늘 날짜 구하기
        let date = new Date();
        let year = date.getFullYear() + '';
        let month = (date.getMonth() + 1) + '';
        let day = date.getDate();

        if(day < 10) {
            day += '';
            day = '0' + day;
        }
        
        let now = new Date(year + '-' + month + '-' + day);        

        // MongoDB에 사용될 데이터
        let data = {create_dt: {$gte: now}};
        // DB연결 및 정보 가져오기
        let ageGender = await ageGenderMongo.findMany(data);
        
        // api로 인해 오늘 데이터가 아직 없는 경우 하루 저 데이터 불러오기
        if(Object.keys(ageGender).length == 0) {
            let yesterDate = now.getTime() - (1 * 24 * 60 * 60 * 1000);
            now.setTime(yesterDate);
            
            data = {create_dt: {$gte: now}};
            ageGender = await ageGenderMongo.findMany(data);
        }

        res.render('ageGender', {ageGender: ageGender});
    }
}