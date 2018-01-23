'use strict'
const express = require('express'),
    User = require('../_models/User.model'),
    Profile = require('../_models/Profile.model'),
    jwt = require('express-jwt'),
    router = express.Router();

var auth = jwt({ 
    secret: process.env.TWYC_SECRET,
    userProperty: 'payload'
});

// Add a profile for a user
router.post('/', auth, (req, res) => {
    var profile = new Profile();
    profile.name = req.body.name;

    profile.save((err, profile) => {
        if (err) { return res.status(400).json(err); }
        User.findById(req.payload._id, (err, user) => {
            user.profiles.push(profile._id);
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

// Get user profile by _id
router.get('/:id', (req, res) => {
    Profile.findById(req.params.id).populate('meals').populate('excersises').exec((err, profile) => {
        if (err) { return res.status(400).json(err); }
        res.json(profile);       
    });
});

// Update a user profile
router.put('/:id', auth, (req, res) => {
    Profile.findById(req.params.id, (err, profile) => {
        if (err) { return res.status(400).json(err); }
        if (req.body.name) {
            profile.name = req.body.name;
        }
        profile.save((err, profile) => {
            if (err) { return res.status(400).json(err); }
            User.findById(req.payload._id).populate('profiles').populate('foods').exec((err, user) => {
                if (err) { return res.status(400).json(err); }
                res.json(user);
            });
        });
    });
});

// Delete a user profile
router.delete('/:id', auth, (req, res) => {
    Profile.remove({ _id: req.params.id }, (err) => {
        if (err) { return res.status(400).json(err); }
        User.findById(req.payload._id, (err, user) => {
            if (err) { return res.status(400).json(err); }
            user.profiles.pull(req.params.id);
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