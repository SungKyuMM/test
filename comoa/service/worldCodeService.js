const fs = require('fs');

module.exports = (world) => {
    return new Promise (resolve => {
        var code = fs.readFileSync('countrycode.json');
        code = JSON.parse(code);

        let jsonData = {};
        world.forEach(data => {
            for(var key in code) {
                if(code[key] == data.nation_nm){
                    jsonData[key] = data;
                }
            }
        });

        resolve(jsonData);
    });    
}