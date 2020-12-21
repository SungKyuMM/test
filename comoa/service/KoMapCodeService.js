const fs = require('fs');

module.exports = (world) => {
    return new Promise (resolve => {
        var code = fs.readFileSync('koMapCode.json');
        code = JSON.parse(code);

        let jsonData = {};
        let covidData = {};
        world.forEach(data => {
            for(var key in code) {
                if(code[key] == data.gubun){
                    jsonData[key] = data;
                    covidData[key] = data.def_cnt;
                }
            }
        });

        let data = {};
        data['world'] = jsonData;
        data['covid'] = covidData;

        resolve(data);
    });    
}