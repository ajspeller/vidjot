const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

// load user model
require('../models/User');
const User = mongoose.model('user');

// user login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// user registration route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// login form post
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// register form POST
router.post('/register', (req, res) => {
  const errors = [];
  if (!req.body.name) {
    errors.push({
      text: 'Please enter a Name.'
    });
  }

  if (!req.body.email) {
    errors.push({
      text: 'Please enter an email address.'
    });
  }

  if (!req.body.password || !req.body.confirm) {
    errors.push({
      text: 'Please confirm the password.'
    });
  }

  if (req.body.password != req.body.confirm) {
    errors.push({
      text: 'Passwords do not match'
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: 'Password must be at least 4 characters.'
    });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirm: req.body.confirm,
    });
  } else {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(user => {
            req.flash('success_msg', 'You are now registered and can now login');
            res.redirect('/users/login');
          }).catch(err => {
            console.log(err);
            return;
          });
      });
    });
  }

});

// logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out!');
  res.redirect('/users/login');
});

module.exports = router;