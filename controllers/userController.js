const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

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
      username: req.body.username,
      password: hashedPassword,
      is_admin: req.body.is_admin,
    });
    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      await user.save();
      res.json({ success: true, user: user });
    }
  }),
];

exports.user_login_post = asyncHandler(async (req, res, next) => {
  function issueJWT(user) {
    const _id = user._id;

    const expiresIn = '1d';

    const payload = {
      sub: _id,
      iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, 'Secret', {
      expiresIn: expiresIn,
      algorithm: 'RS256',
    });

    return {
      token: 'Bearer ' + signedToken,
      expires: expiresIn,
    };
  }

  await User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, msg: 'could not find user' });
    }
    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      const tokenObject = issueJWT(user);
      res.status(200).json({
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    } else {
      res
        .status(401)
        .json({ success: false, msg: 'you entered the wrong password' });
    }
  });
});
