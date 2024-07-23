const pool = require('../pool');

async function getCommentsByPostId(postId) {
  const { rows } = await pool.query(
    'SELECT comments.*, users.username FROM comments INNER JOIN users ON comments.users_id = users.id WHERE comments.posts_id = $1',
    [postId]
  );
  console.log(rows)
  return rows;
}

async function insertComment(content, date, user, post) {
  await pool.query(
    'INSERT INTO comments(content, date, users_id, posts_id) VALUES($1, $2, $3, $4)',
    [content, date, user, post]
  );
}

async function deleteComment(commentId) {
  await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
}

async function deleteAllPostsComments(postId) {
  await pool.query('DELETE FROM comments WHERE posts_id = $1', [postId]);
}


module.exports = {
  getCommentsByPostId,
  insertComment,
  deleteComment,
  deleteAllPostsComments,
};
