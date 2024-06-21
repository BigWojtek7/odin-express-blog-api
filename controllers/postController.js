const Post = require('../models/post');
const Comment = require('../models/comment');
const { jwtDecode }  = require('jwt-decode')

const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

exports.all_posts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find().sort({ date: 1 }).exec();

  res.json(allPosts);
});

exports.single_post = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postid);
  res.json(post);
});

// create post

exports.post_create_post = [
  body('title', 'title is required').trim().isLength({ min: 1 }).escape(),
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res) => {
    const userId = jwtDecode(req.headers.authorization).sub
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: new Date(),
      user: userId,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.json(errors.array());
    } else {
      // Data from form is valid.

      // Save author.
      await post.save();
      // Redirect to new author record.
      res.json('Post saved');
    }
  }),
];

// delete post

exports.post_delete = asyncHandler(async (req, res) => {
  // const [post, allComments] = await Promise.all([
  //   Post.findById(req.params.id).exec(),
  //   Comment.findOneAndDelete({ post: req.params.id }).exec(),
  // ]);
  console.log(req.params.postid)
  const post = await Post.findByIdAndDelete(req.params.postid);
  const comment = await Comment.deleteMany({ post: req.params.postid });
  console.log("1", post, "2", comment)
  res.json('Post deleted');
});

// edit post

exports.post_edit = [
  body('title', 'title is required').trim().isLength({ min: 1 }).escape(),
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      user: req.body.user,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.json(errors.array());
    } else {
      // Data from form is valid.

      await Post.findByIdAndUpdate(req.params.id, post, {});

      res.json('Post edited');
    }
  }),
];
