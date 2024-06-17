const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');
const passport = require('passport');
/* GET users listing. */
router.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.status(200).json({
      success: true,
      msg: 'You are successfully authenticated to this route!',
    });
  }
);
router.post('/sign-up', user_controller.user_create_post);
router.post('/login', user_controller.user_login_post);
module.exports = router;
