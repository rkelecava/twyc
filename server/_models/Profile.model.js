'use strict';
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: { type: String, lowercase: true, unique: true },
    entries: []
});

module.exports = mongoose.model('Profile', Schema);