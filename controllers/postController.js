const Post = require('../models/post');

const asyncHandler = require('express-async-handler');

exports.all_posts = asyncHandler(async (req, res) => {
  const allPosts = await Post.find().sort({ date: 1 }).exec();

  res.json(allPosts);
});

exports.single_post = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postid);
  res.json(post);
});
