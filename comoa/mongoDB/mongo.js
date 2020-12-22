var mongo = require('mongoose');

// 몽고 DB 컨넥터
module.exports = () => {
    let connect = () => {
        const db = 'comoaDB';
        const url = 'mongodb://localhost:27017/' + db;
        mongo.set('useUnifiedTopology', true);
        mongo.connect(url, {useNewUrlParser: true}, (err) => {
            if(err) console.error('mongoDB connection error', err);
            else console.log('mongoDB connected!');
        });       
    };
    connect();    
    mongo.connection.on('disconnected', connect);   // DB가 disconnected되면 다시 재연결
    
    require('./schema/user');
    require('./schema/board');
    require('./schema/safetyNews');
    require('./schema/infectionStatus');
    require('./schema/ageGenderStatus');
    require('./schema/cityStatus');
    require('./schema/overseaOutbreak');
};