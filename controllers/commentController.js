// const Post = require('../models/post')
const dbComments = require('../db/queries/commentsQueries');
const { jwtDecode } = require('jwt-decode');

const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

exports.post_comments = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const postComments = await dbComments.getCommentsByPostId(postId);
  res.json(postComments);
});

exports.comment_create_post = [
  body('content', 'content is required').trim().isLength({ min: 1 }),

  asyncHandler(async (req, res) => {
    const userId = jwtDecode(req.headers.authorization).sub;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ success: false, msg: errors.array() });
    } else {
      const content = req.body.content;
      const date = new Date();
      const user = userId;
      const post = req.params.postid;

      const createComment = await dbComments.insertComment(
        content,
        date,
        user,
        post
      );
      // res.json(createComment);
      res.json({
        success: true,
        msg: 'Comment has been saved',
        data: createComment ,
      });
    }
  }),
];

exports.comment_delete = asyncHandler(async (req, res) => {
  const commentId = req.params.commentid;
  await dbComments.deleteComment(commentId);
  res.json({ success: true, msg: 'Comment has been deleted' });
});
