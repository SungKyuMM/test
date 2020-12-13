const bcrypt = require('bcrypt');
const userMongo = require('../mongoDB/userMongo');
const services = require('./coronaService');

var users = {};

users.registerUser = (data) => {
    data.password = bcrypt.hashSync(data.password, 10);

    userMongo.insertMany(data);
};

module.exports = users;