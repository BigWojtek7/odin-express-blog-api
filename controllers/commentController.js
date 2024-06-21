// const Post = require('../models/post')

const Comment = require('../models/comment');
const { jwtDecode }  = require('jwt-decode')

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.post_comments = asyncHandler(async (req, res) => {
  const postComments = await Comment.find({ post: req.params.postid }).populate('user', 'username').exec();

  res.json(postComments);
});

exports.single_comment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentid).exec();
  res.json(comment);
});

exports.comment_create_post = [
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res) => {
    const userId = jwtDecode(req.headers.authorization).sub

    const errors = validationResult(req);

    const comment = new Comment({
      content: req.body.content,
      date: new Date(),
      user: userId,
      post: req.params.postid,
    });

    if (!errors.isEmpty()) {
      return res.json(errors.array());
    } else {
      await comment.save();
      res.json('Comment saved');
    }
  }),
];

exports.comment_delete = asyncHandler(async (req, res) => {
  await Comment.findByIdAndDelete(req.params.commentid);
  res.json('Comment deleted');
});

exports.comment_edit = [
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const comment = new Comment({
      content: req.body.content,
      date: req.body.date,
      user: req.body.user,
      post: req.body.post,
    });

    if (!errors.isEmpty()) {
      return res.json(errors.array());
    } else {
      await Comment.findByIdAndUpdate(req.params.id, comment, {});
      res.json('Comment edited');
    }
  }),
];
