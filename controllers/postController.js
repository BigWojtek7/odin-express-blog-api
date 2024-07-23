const dbPosts = require('../db/queries/postsQueries');
const dbComments = require('../db/queries/commentsQueries');

const { jwtDecode } = require('jwt-decode');

const asyncHandler = require('express-async-handler');

const { body, validationResult } = require('express-validator');

exports.all_posts = asyncHandler(async (req, res) => {
  // const allPosts = await Post.find().populate('user').sort({ date: 1 }).exec();
  const allPosts = await dbPosts.getAllPosts();

  res.json(allPosts);
});

exports.single_post = asyncHandler(async (req, res) => {
  const postId = req.params.postid;
  const post = await dbPosts.getSinglePost(postId);
  res.json(post);
});

// create post

exports.post_create_post = [
  body('title', 'title is required').trim().isLength({ min: 1 }).escape(),
  body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

  asyncHandler(async (req, res) => {
    const userId = jwtDecode(req.headers.authorization).sub;
    const errors = validationResult(req);

    // const post = new Post({
    //   title: req.body.title,
    //   content: req.body.content,
    //   date: new Date(),
    //   user: userId,
    // });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      return res.json(errors.array());
    } else {
      const title = req.body.title;
      const content = req.body.content;
      const date = new Date();
      const user = userId;

      await dbPosts.insertPost(title, content, date, user);
      
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
  const postId = req.params.postid;
  const post = await dbPosts.deletePost(postId)
  const comment = await dbComments.deleteAllPostsComments(postId)
  console.log('1', post, '2', comment);
  res.json('Post deleted');
});

// edit post

// exports.post_edit = [
//   body('title', 'title is required').trim().isLength({ min: 1 }).escape(),
//   body('content', 'content is required').trim().isLength({ min: 1 }).escape(),

//   asyncHandler(async (req, res) => {
//     const errors = validationResult(req);

//     const post = new Post({
//       title: req.body.title,
//       content: req.body.content,
//       date: req.body.date,
//       user: req.body.user,
//     });

//     if (!errors.isEmpty()) {
//       // There are errors. Render form again with sanitized values/errors messages.
//       return res.json(errors.array());
//     } else {
//       // Data from form is valid.

//       await Post.findByIdAndUpdate(req.params.id, post, {});

//       res.json('Post edited');
//     }
//   }),
// ];
