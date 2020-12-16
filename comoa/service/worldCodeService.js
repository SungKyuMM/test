const fs = require('fs');

module.exports = (world) => {
    return new Promise (resolve => {
        var code = fs.readFileSync('countrycode.json');
        code = JSON.parse(code);

        let jsonData = {};
        let covidData = {};
        world.forEach(data => {
            for(var key in code) {
                if(code[key] == data.nation_nm){
                    jsonData[key] = data;
                    covidData[key] = data.nat_death_cnt;
                }
            }
        });

        let data = {};
        data['world'] = jsonData;
        data['covid'] = covidData;

        resolve(data);
    });    
}