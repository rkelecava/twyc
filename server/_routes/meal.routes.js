'use strict';
const express = require('express'),
    jwt = require('express-jwt'),
    Authorize = require('../_helpers/Authorize'),
    User = require('../_models/User.model'),
    Meal = require('../_models/Meal.model'),
    Userfood = require('../_models/Userfood.model'),
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

// Add a user food to a user defined meal
router.get('/addUserFoodToMeal/:meal/:userfood', (req, res) => {
    Meal.findById({ _id: req.params.meal }, (err, meal) => {
        if (err) { return res.status(400).json(err); }
        meal.userfoods.push(req.params.userfood);
        meal.save((err) => {
            if (err) { return res.status(400).json(err); }
            Meal.findById({ _id: req.params.meal }).populate('userfoods').exec((err, meal) => {
                if (err) { return res.status(400).json(err); }
                res.json(meal);
            });
        });
    });
});

// Remove a user food from a user defined meal
router.get('/removeUserFoodFromMeal/:meal/:userfood', (req, res) => {
    Meal.findById({ _id: req.params.meal }, (err, meal) => {
        if (err) { return res.status(400).json(err); }
        meal.userfoods.splice(meal.userfoods.indexOf(req.params.userfood), 1);
        meal.save((err) => {
            if (err) { return res.status(400).json(err); }
            Meal.findById({ _id: req.params.meal }).populate('userfoods').exec((err, meal) => {
                if (err) { return res.status(400).json(err); }
                res.json(meal);
            });
        });
    });
});

// Add a default food to a user defined meal
router.get('/addDefaultFoodToMeal/:meal/:defaultfood', (req, res) => {
    Meal.findById({ _id: req.params.meal }, (err, meal) => {
        if (err) { return res.status(400).json(err); }
        meal.defaultfoods.push(req.params.defaultfood);
        meal.save((err) => {
            if (err) { return res.status(400).json(err); }
            Meal.findById({ _id: req.params.meal }).populate('defaultfoods').exec((err, meal) => {
                if (err) { return res.status(400).json(err); }
                res.json(meal);
            });
        });
    });
});

// Remove a default food from a user defined meal
router.get('/removeDefaultFoodFromMeal/:meal/:defaultfood', (req, res) => {
    Meal.findById({ _id: req.params.meal }, (err, meal) => {
        if (err) { return res.status(400).json(err); }
        meal.defaultfoods.splice(meal.defaultfoods.indexOf(req.params.defaultfood), 1);
        meal.save((err) => {
            if (err) { return res.status(400).json(err); }
            Meal.findById({ _id: req.params.meal }).populate('defaultfoods').exec((err, meal) => {
                if (err) { return res.status(400).json(err); }
                res.json(meal);
            });
        });
    });
});

module.exports = router;