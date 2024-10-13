const asyncHandler = require('express-async-handler');

const dbUser = require('../db/queries/userQueries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { jwtDecode } = require('jwt-decode');
const issueJWT = require('../config/issueJwt');

exports.user_get = asyncHandler(async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).sub;
  const user = await dbUser.getUsername(userId);
  res.json(user);
});

exports.user_create_post = [
  body('username', 'Username is required').trim().isLength({ min: 1 }),
  body('password', 'Password is required').trim().isLength({ min: 1 }),
  body('re_password', 'Password does not match')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .trim(),

  asyncHandler(async (req, res) => {
    const reqUsername = req.body.username;
    const userInDatabase = await dbUser.getUserByUsername(reqUsername);

    if (userInDatabase?.username) {
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
      const user = await dbUser.insertUser(username, password, isAdmin);
      const tokenObject = issueJWT(user);
      res.json({
        success: true,
        msg: 'User has been created',
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
      });
    }
  }),
];

exports.user_login_post = asyncHandler(async (req, res, next) => {
  try {
    const username = req.body.username;
    const user = await dbUser.getUserByUsername(username);
    if (!user?.username) {
      return res
        .status(401)
        .json({ success: false, msg: 'could not find the user' });
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
