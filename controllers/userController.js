const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

const User = require('../models/user');

exports.user_get = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const user = await User.findById(userId, { username: 1, _id: 0 }).exec();
  res.json(user);
});

exports.user_create_post = [
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
    console.log(req.body);
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
      res.redirect('/');
    }
  }),
];

exports.user_login_post = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  function issueJWT(user) {
    const _id = user._id;

    const expiresIn = '1d';

    const payload = {
      sub: _id,
      iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, 'Secret', {
      expiresIn: expiresIn,
      // algorithm: 'RS256',
    });

    return {
      token: 'Bearer ' + signedToken,
      expires: expiresIn,
    };
  }
  try {
    const user = await User.findOne({ username: req.body.username }).exec();

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
  } catch (err) {
    next(err);
  }
});
