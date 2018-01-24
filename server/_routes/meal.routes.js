'use strict';
const express = require('express'),
    jwt = require('express-jwt'),
    Authorize = require('../_helpers/Authorize'),
    User = require('../_models/User.model'),
    Meal = require('../_models/Meal.model'),
    router = express.Router();

var auth = jwt({ 
    secret: process.env.TWYC_SECRET,
    userProperty: 'payload'
});

// Get all user defined meals
router.get('/', auth, (req, res) => {
    console.log(req.payload._id);
    User.findById(req.payload._id).populate({ 
        path: 'meals',
        populate: {
            path: 'userfoods defaultfoods'
        }
    }).exec((err, user) => {
        if (err) { return res.status(400).json(err); }
        res.json(user.meals);
    });
});

// Get user defined meal by _id
router.get('/:id', (req, res) => {
    Meal.findById(req.params.id).populate({ path: 'userfoods defaultfoods' }).exec((err, meal) => {
        if (err) { return res.status(400).json(err); }
        res.json(meal);       
    });
});

// Add a user defined meal
router.post('/', auth, (req, res) => {
    var meal = new Meal(req.body);
    meal.save((err, meal) => {
        if (err) { return res.status(400).json(err); }
        User.findById(req.payload._id, (err, user) => {
            if (err) { return res.status(400).json(err); }
            user.meals.push(meal._id);
            user.save((err) => {
                if (err) { return res.status(400).json(err); }
                User.findById(req.payload._id).populate({ path: 'profiles foods meals' }).exec((err, user) => {
                    if (err) { return res.status(400).json(err); }
                    res.json(user);
                });
            });
        });
    });
});

module.exports = router;