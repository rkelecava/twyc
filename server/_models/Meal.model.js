'use strict';
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name: { type: String, lowercase: true, unique: true },
    mealType: { type: String, lowercase: true },
    userfoods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Userfood' }],
    defaultfoods: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Defaultfood' }],
});

module.exports = mongoose.model('Meal', Schema);