const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.user_create_post = [
  body('first_name', 'First Name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('last_name', 'Last Name is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('username', 'Username is required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password is required').trim().isLength({ min: 1 }).escape(),
  body('re_password', 'Password does not match')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .trim()
    .escape(),
  body('is_admin').escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashedPassword,
      member_status: false,
      is_admin: req.body.is_admin === 'checked',
    });
    if (!errors.isEmpty()) {
      res.render('sign-up-form', {
        user: user,
        errors: errors.array(),
      });
    } else {
      await user.save();
      res.redirect('/');
    }
  }),
];
