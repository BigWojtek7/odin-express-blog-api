const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');
// const user_controller = require('../controllers/userController');

// GET all posts

router.get('/', post_controller.all_posts);

//GET single post

router.get('/:postid', post_controller.single_post);

// GET all comments for single post

router.get('/:postid/comments', comment_controller.post_comments);

// GET single comment

router.get('/:postid/comments/:commentid', comment_controller.single_comment);

// POST create post

router.post('/', post_controller.post_create_post);

// POST CREATE comment

router.post('/:postid/comments', comment_controller.comment_create_post);

// EDIT post

router.put('/:postid', post_controller.post_edit);

// EDIT comment

router.put('/:postid/comments/:commentid', comment_controller.comment_edit);

// DELETE post

router.delete('/:postid', post_controller.post_delete);

// DELETE comment

router.delete(
  '/:postid/comments/:commentid',
  comment_controller.comment_delete
);

module.exports = router;
