'use strict';
const express = require('express'),
    jwt = require('express-jwt'),
    Authorize = require('../_helpers/Authorize'),
    Defaultfood = require('../_models/Defaultfood.model'),
    router = express.Router();

var auth = jwt({ 
    secret: process.env.TWYC_SECRET,
    userProperty: 'payload'
});

// Get all default foods
router.get('/', (req, res) => {
    Defaultfood.find({}, (err, foods) => {
        if (err) { return res.status(400).json(err); }
        res.json(foods);
    });
});

// Get default food by _id
router.get('/:id', (req, res) => {
    Defaultfood.findById(req.params.id, (err, food) => {
        if (err) { return res.status(400).json(err); }
        res.json(food);       
    });
});

// Add a default food
router.post('/', auth, Authorize.isAdmin, (req, res) => {
    var food = new Defaultfood(req.body);
    food.save((err, food) => {
        if (err) { return res.status(400).json(err); }
        res.json(food);
    });
});

// Update a default food
router.put('/:id', auth, Authorize.isAdmin, (req, res) => {
    Defaultfood.findById(req.params.id, (err, food) => {
        if (err) { return res.status(400).json(err); }
        if (req.body.brand) {
            food.brand = req.body.brand;
        }
        if (req.body.name) {
            food.name = req.body.name;
        }
        if (req.body.unitOfMeasure) {
            food.unitOfMeasure = req.body.unitOfMeasure;
        }
        if (req.body.amount) {
            food.amount = req.body.amount;
        }
        if (req.body.calories) {
            food.calories = req.body.calories;
        }
        if (req.body.carbs) {
            food.carbs = req.body.carbs;
        }
        if (req.body.protein) {
            food.protein = req.body.protein;
        }
        if (req.body.fat) {
            food.fat = req.body.fat;
        }
        food.save((err, food) => {
            if (err) { return res.status(400).json(err); }
            res.json(food);
        });
    });
});

// Delete a default food
router.delete('/:id', auth, Authorize.isAdmin, (req, res) => {
    Defaultfood.remove({ _id: req.params.id }, (err) => {
        if (err) { return res.status(400).json(err); }
        res.json({ msg: 'Removed' });
    });
});

module.exports = router;