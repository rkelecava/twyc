'use strict';
const express = require('express'),
    User = require('../_models/User.model'),
    Userfood = require('../_models/Userfood.model'),
    Entry = require('../_models/Entry.model'),
    Profile = require('../_models/Profile.model'),
    Meal = require('../_models/Meal.model'),
    Passport = require('passport'),
    jwt = require('express-jwt'),
    Authorize = require('../_helpers/Authorize'),
    async = require('async'),
    router = express.Router();

var auth = jwt({ 
    secret: process.env.TWYC_SECRET,
    userProperty: 'payload'
});

// Get all users
router.get('/', auth, Authorize.isAdmin, (req, res) => {
    User.find({}, (err, users) => {
        if (err) { return res.status(400).json(err); }
        res.json(users);
    });
});

// Get user by _id
router.get('/:id', auth, Authorize.isAdmin, (req, res) => {
    User.findById(req.params.id).populate({ path: 'profiles foods meals' }).exec((err, user) => {
        if (err) { return res.status(400).json(err); }
        async.forEach(user.profiles, (profile, callback) => {
            Entry.populate(profile,{ "path": "entries", populate: { "path": "meals userfoods defaultfoods customfoods" } },(err,entry) => {
                if (err) { return res.status(400).json(err); }
                callback();
            });
        }, (err) => {
            res.json(user); 
        });      
    });
});

// Update a user
router.put('/:id', auth, Authorize.isAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) { return res.status(400).json(err); }
        if (req.body.password) {
            user.setPassword(req.body.password);
        }
        if (req.body.first) {
            user.first = req.body.first;
        }
        if (req.body.last) {
            user.last = req.body.last;
        }
        user.save((err, user) => {
            if (err) { return res.status(400).json(err); }
            res.json(user);
        });
    });
});

// Give a user admin permission
router.get('/:id/makeAdmin', auth, Authorize.isAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) { return res.status(400).json(err); }
        var found = false;
        async.forEach(user.roles, (role, callbackRole) => {
            if (role === 'admin') {
                found = true;
            }
            callbackRole();
        }, (err) => {   
            if (!found) {
                user.roles.push('admin');
            }
            user.save((err, user) => {
                if (err) { return res.status(400).json(err); }
                res.json(user);
            });
        });
    });
});

// Revoke a user admin permission
router.get('/:id/revokeAdmin', auth, Authorize.isAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) { return res.status(400).json(err); }
        var found = false;
        async.forEach(user.roles, (role, callbackRole) => {
            if (role === 'admin') {
                found = true;
            }
            callbackRole();
        }, (err) => {   
            if (found) {
                user.roles.splice(user.roles.indexOf('admin'), 1);
            }
            user.save((err, user) => {
                if (err) { return res.status(400).json(err); }
                res.json(user);
            });
        });
    });
});


// Delete a user
router.delete('/:id', auth, Authorize.isAdmin, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        async.each(user.profiles, (profile, profileDeleted) => {
            Profile.remove({ _id: profile }, (err) => {
                if (err) { return res.status(400).json(err); }
                profileDeleted();
            });
        }, (err) => {
            if (err) { return res.status(400).json(err); }
            async.each(user.foods, (food, foodDeleted) => {
                Userfood.remove({ _id: food }, (err) => {
                    if (err) { return res.status(400).json(err); }
                    foodDeleted();
                });
            }, (err) => {
                if (err) { return res.status(400).json(err); }
                async.each(user.meals, (meal, mealDeleted) => {
                    Meal.remove({ _id: meal }, (err) => {
                        if (err) { return res.status(400).json(err); }
                        mealDeleted(); 
                    });
                }, (err) => {
                    User.remove({ _id: req.params.id }, (err) => {
                        if (err) { return res.status(400).json(err); }
                        res.json({ msg: 'Removed' });
                    });
                })
            });
        });
    });
});

// Register a new user
router.post('/register', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            msg: 'You must enter a valid username and password'
        });
    }

    var user = new User();
    user.roles = req.body.roles.split(",");
    user.username = req.body.username;
    user.first = req.body.first;
    user.last = req.body.last;
    user.setPassword(req.body.password);

    user.save((err) => {
        if (err) { return res.status(400).json(err); }
        
        res.json({ token: user.generateJWT() });
    });
});

// Authenticate a user
router.post('/authenticate', (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({
            msg: 'You must enter a valid username and password'
        });
    }

    Passport.authenticate('local', (err, user, info) => {
        
        if (err) { return res.status(400).json(err); }

        if (user) {
            return res.json({ token: user.generateJWT() });
        } else {
            return res.status(401).json(info);
        }

    })(req, res);

});

module.exports = router;