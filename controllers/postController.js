const Post = require('../models/post');


const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator')

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
  body('title', 'title is required')
    .trim()
    .isLength({ min: 1})
    .escape(),
  body('content', 'content is required')
    .trim()
    .isLength({ min: 1})
    .escape(),

  
  asyncHandler(async(req, res) => {
    console.log(req.body)
    const errors = validationResult(req)

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      date: req.body.date,
      user: req.body.user,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.json(errors.array())
    } else {
      // Data from form is valid.

      // Save author.
      await post.save();
      // Redirect to new author record.
      res.json('Post saved')
    }
  }),
]