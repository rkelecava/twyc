'use strict';
const mongoose = require('mongoose'),
    config = require('./index');

function connect() {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://' + config.mongo.host + '/' + config.mongo.db, (err) => {
        if (err) { 
            console.log(err);
            process.exit();
        }
    
        console.log('connected to ' + config.mongo.db + ' on ' + config.mongo.host);
    }); 
}

module.exports = { connect };