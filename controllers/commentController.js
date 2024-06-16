// const Post = require('../models/post')

const Comment = require('../models/comment');

const asyncHandler = require('express-async-handler');

exports.post_comments = asyncHandler(async (req, res) => {
  const postComments = await Comment.find({ post: req.params.postid }).exec();
  
  res.json(postComments);
});

exports.single_comment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentid).exec();
  res.json(comment)
})
