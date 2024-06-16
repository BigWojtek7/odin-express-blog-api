const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
// const user_controller = require('../controllers/userController');

// GET all posts

router.get('/', post_controller.all_posts);

//GET single post

router.get('/:postid', post_controller.single_post);

module.exports = router;

// GET all comments for single post

router.get('/:postid/comments', comment_controller.post_comments);

// GET single comment

router.get('/:postid/comments/:commentid', comment_controller.single_comment);
