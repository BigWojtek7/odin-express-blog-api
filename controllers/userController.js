const asyncHandler = require('express-async-handler');

const dbUser = require('../db/queries/userQueries')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

const User = require('../models/user');

exports.user_get = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const user = await dbUser.getUsername(userId)
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

  asyncHandler(async (req, res) => {
    const userInDatabase = await User.find({
      username: req.body.username,
    }).exec();

    if (userInDatabase.length > 0) {
      res.json({ success: false, msg: [{ msg: 'Username already exists' }] });
      return;
    }

    const errors = validationResult(req);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const username = req.body.username;
    const password = hashedPassword;
    const isAdmin = false;
    

    if (!errors.isEmpty()) {
      res.json({ success: false, msg: errors.array() });
    } else {
      await dbUser.insertUser(username, password, isAdmin)
      res.json({ success: true });
    }
  }),
];

exports.user_login_post = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  function issueJWT(user) {
    const _id = user._id;
    const isAdmin = user.is_admin;

    const expiresIn = '1d';

    const payload = {
      sub: _id,
      admin: isAdmin,
      iat: Date.now(),
    };
    const secret = process.env.JWT_SECRET;
    console.log(secret);
    const signedToken = jsonwebtoken.sign(payload, secret, {
      expiresIn: expiresIn,
      // algorithm: 'RS256',
    });

    return {
      token: 'Bearer ' + signedToken,
      expires: expiresIn,
    };
  }
  try {
    const username = req.body.username;
    const user = await dbUser.getUserByUsername(username);

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
