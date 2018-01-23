'use strict';
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    brand: { type: String, lowercase: true },
    name: { type: String, lowercase: true },
    unitOfMeasure: { type: String, lowercase: true },
    amount: Number,
    calories: Number,
    carbs: Number,
    protein: Number,
    fat: Number
});

module.exports = mongoose.model('Userfood', Schema);