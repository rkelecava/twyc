'use strict';
const mongoose = require('mongoose'),
    crypto = require('crypto'),
    jwt = require('jsonwebtoken');

const Schema = new mongoose.Schema({
    username: { type: String, lowercase: true, unique: true },
    hash: String,
    salt: String,
    first: String,
    last: String,
    roles: [String],
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
    foods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userfood' }],
    exercises: [],
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
});

Schema.methods.setPassword = function (password) {
    this.salt = this.salt = crypto.randomBytes(16).toString('hex');

    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'SHA1').toString('hex');
};

Schema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'SHA1').toString('hex');

    return this.hash === hash;
};

Schema.methods.generateJWT = function () {

    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 1);

    return jwt.sign({
        _id: this._id,
        username: this.username,
        first: this.first,
        last: this.last,
        roles: this.roles,
        exp: parseInt(exp.getTime() / 1000)
    }, process.env.TWYC_SECRET);
};

module.exports = mongoose.model('User', Schema);