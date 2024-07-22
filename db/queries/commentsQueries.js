const pool = require('../pool');

async function getCommentsByPostId(postId) {
  const { rows } = await pool.query(
    'SELECT * FROM comments WHERE post_id = $1',
    [postId]
  );
  return rows;
}

async function insertComment(content, date, user, post) {
  await pool.query(
    'INSERT INTO comments(content, date, user, post) VALUES($1, $2, $3, $4)',
    [content, date, user, post]
  );
}

async function deleteComment(commentId) {
  await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
}

module.exports = {
  getCommentsByPostId,
  insertComment,
  deleteComment,
};
