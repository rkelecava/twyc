'use strict';
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }],
    userfoods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userfood' }],
    defaultfoods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defaultfood' }],
    customfoods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customfood' }]
});

module.exports = mongoose.model('Entry', Schema);