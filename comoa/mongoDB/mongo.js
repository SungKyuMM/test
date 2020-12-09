var mongo = require('mongoose');

module.exports = () => {
    let connect = () => {
        const db = 'comoaDB';
        const url = 'mongodb://localhost:27017/' + db;
        mongo.set('useUnifiedTopology', true);
        mongo.connect(url, {useNewUrlParser: true}, (err) => {
            if(err) console.error('mongoDB connection error', err);

            console.log('mongoDB connected!');
        });       
    };
    connect();    
    mongo.connection.on('disconnected', connect);
    
    require('./schema/user');
    require('./schema/safetyNews');
    require('./schema/infectionStatus');
    require('./schema/ageGenderStatus');
    require('./schema/cityStatus');
    require('./schema/overseaOutbreak');
};