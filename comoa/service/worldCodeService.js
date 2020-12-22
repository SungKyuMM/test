const fs = require('fs');

// 국가 코드 부여 서비스
module.exports = (world) => {
    return new Promise (resolve => {
        var code = fs.readFileSync('countrycode.json'); // 국가 코드 json 파일 가져오기
        code = JSON.parse(code);                        // json parse

        let jsonData = {};
        let covidData = {};
        world.forEach(data => {                         // DB데이터 만큼 forEach
            for(var key in code) {                      // 국가 코드 key
                if(code[key] == data.nation_nm){        // 국가 코드 국가명 비교
                    jsonData[key] = data;               // 코드별 국가 코로나 데이터
                    covidData[key] = data.nat_death_cnt;// 코드별 코로나 위험도
                }
            }
        });

        let data = {};
        data['world'] = jsonData;
        data['covid'] = covidData;

        resolve(data);
    });    
}