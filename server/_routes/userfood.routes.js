'use strict';
const express = require('express'),
    jwt = require('express-jwt'),
    Authorize = require('../_helpers/Authorize'),
    User = require('../_models/User.model'),
    Userfood = require('../_models/Userfood.model'),
    Defaultfood = require('../_models/Defaultfood.model'),
    router = express.Router();

var auth = jwt({ 
    secret: process.env.TWYC_SECRET,
    userProperty: 'payload'
});

// Get all user foods including defaults
router.get('/', auth, (req, res) => {
    var allFoods = [];
    Defaultfood.find({}, (err, foods) => {
        if (err) { return res.status(400).json(err); }
        allFoods = foods;
        User.findById(req.payload._id).populate('foods').exec((err, user) => {
            if (err) { return res.status(400).json(err); }
            allFoods.concat(user.foods);
            res.json(allFoods);
        });
    });
});

// Get all user foods excluding defaults
router.get('/nodefaults', auth, (req, res) => {
    User.findById(req.payload._id).populate('foods').exec((err, user) => {
        if (err) { return res.status(400).json(err); }
        res.json(user.foods);
    });
});

// Get user food by _id
router.get('/:id', (req, res) => {
    Userfood.findById(req.params.id, (err, food) => {
        if (err) { return res.status(400).json(err); }
        res.json(food);       
    });
});

// Add a user food
router.post('/', auth, (req, res) => {
    var food = new Userfood(req.body);
    food.save((err, food) => {
        if (err) { return res.status(400).json(err); }
        User.findById(req.payload._id, (err, user) => {
            if (err) { return res.status(400).json(err); }
            user.foods.push(food._id);
            user.save((err) => {
                if (err) { return res.status(400).json(err); }
                User.findById(req.payload._id).populate('profiles').populate('foods').exec((err, user) => {
                    if (err) { return res.status(400).json(err); }
                    res.json(user);
                });
            });
        });
    });
});

// Update a user food
router.put('/:id', auth, (req, res) => {
    Userfood.findById(req.params.id, (err, food) => {
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
            User.findById(req.payload._id).populate('profiles').populate('foods').exec((err, user) => {
                if (err) { return res.status(400).json(err); }
                res.json(user);
            });
        });
    });
});

// Delete a user food
router.delete('/:id', auth, (req, res) => {
    Userfood.remove({ _id: req.params.id }, (err) => {
        if (err) { return res.status(400).json(err); }
        User.findById(req.payload._id, (err, user) => {
            if (err) { return res.status(400).json(err); }
            user.foods.pull(req.params.id);
            user.save((err) => {
                if (err) { return res.status(400).json(err); }
                User.findById(req.payload._id).populate('profiles').populate('foods').exec((err, user) => {
                    if (err) { return res.status(400).json(err); }
                    res.json(user);
                });
            });
        });
    });
});

module.exports = router;