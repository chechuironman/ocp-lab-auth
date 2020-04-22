const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");


var pino = require('pino')()

router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
    // console.log(req.body);
  // Check validatio
  console.log(isValid);
    if (!isValid) {
      console.log(errors);
      var allErrors = ''
      if (errors.firstName){
        allErrors = errors.firstName+' , '+allErrors;
      }
      if (errors.lastName){
        allErrors = errors.lastName+' , '+allErrors;  
      }
      if (errors.email){
        allErrors = errors.email+' , '+allErrors;
      }
      if (errors.company){
        allErrors = errors.company+' , '+allErrors;
      }
      if (errors.password2){
        allErrors = errors.password2+' , '+allErrors;
      }
      if (errors.password){
        allErrors = errors.password+' , '+allErrors;
      }

      
      return res.status(400).json({error: allErrors});
    }
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ error: "Email already exists" });
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          companyName: req.body.companyName,
          email: req.body.email,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
  });
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json({error: 'Login is NOT valid'});
    }
  const email = req.body.email;
  const password = req.body.password;
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(404).json({ error: "Email not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = {
            id: user.id,
            name: user.email
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 360 
            },
            (err, token) => {
              pino.info('user %s logged',user.name)
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          pino.error('Password Incorrect')
          return res
            .status(400)
            .json({ error: "Password incorrect" });
        }
      });
    });
  });
  module.exports = router;