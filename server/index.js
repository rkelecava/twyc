'use strict';
if (!process.env.TWYC_SECRET) {
    var env = require('./_helpers/env.js');
}

const express = require('express'),
    app = express(),
    port = process.env.port || 5150,
    Db = require('./_config/Database'),
    models = require('./_models'),
    routes = require('./_routes'),
    mongoose = require('mongoose'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    cors = require('cors'),
    passport = require('passport');

models.load();
require('./_config/Passport');

Db.connect();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));
app.use(passport.initialize());

routes.load(app);

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(port, (err) => {
    if (err) {
      return console.log('something bad happened', err);
    }

    console.log(`server is listening on ${port}`);
});
