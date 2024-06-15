const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
// const comment_controller = require('../controllers/commentController');
// const user_controller = require('../controllers/userController');

// GET all posts

router.get('/', post_controller.all_posts);

module.exports = router;
