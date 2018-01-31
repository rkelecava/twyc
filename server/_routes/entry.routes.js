'use strict'
const express = require('express'),
    User = require('../_models/User.model'),
    Profile = require('../_models/Profile.model'),
    Entry = require('../_models/Entry.model'),
    Userfood = require('../_models/Userfood.model'),
    Defaultfood = require('../_models/Defaultfood.model'),
    Meal = require('../_models/Meal.model'),
    jwt = require('express-jwt'),
    router = express.Router();

var auth = jwt({ 
    secret: process.env.TWYC_SECRET,
    userProperty: 'payload'
});

router.get('/meal/:profile/:meal', auth, (req, res) => {
    var entry = new Entry();
    entry.meals.push(req.params.meal);
    entry.save((err, entry) => {
        if (err) { return res.status(400).json(err); }
        Profile.findById(req.params.profile).exec((err, profile) => {
            if (err) { return res.status(400).json(err); }
            profile.entries.push(entry._id);
            profile.save((err) => {
                if (err) { return res.status(400).json(err); }
                User.findById(req.payload._id).populate({
                    path: 'profiles',
                    populate: {
                        path: 'entries',
                        populate: 'meals userfoods defaultfoods customfoods'
                    }
                }).exec((err, user) => {
                    if (err) { return res.status(400).json(err); }
                    res.json(user);
                });
            });
        });
    });
});


module.exports = router;