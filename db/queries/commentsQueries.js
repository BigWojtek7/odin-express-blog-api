const pool = require('../pool');

async function getCommentsByPostId(postId) {
  const { rows } = await pool.query(
    `SELECT comments.*, users.username, to_char(comments.date, 'DD-MM-YYYY HH24:MI') AS date_format FROM comments INNER JOIN users ON comments.user_id = users.id WHERE comments.post_id = $1`,
    [postId]
  );
  console.log(rows);
  return rows;
}

async function insertComment(content, date, user, post) {
  const { rows } = await pool.query(
    `INSERT INTO comments(content, date, user_id, post_id) VALUES($1, $2, $3, $4) RETURNING *`,
    [content, date, user, post]
  );
  const commentId = rows[0].id;
  const { rows: commentWithUserData } = await pool.query(
    `SELECT 
      comments.id,
      comments.user_id,
      comments.post_id,
      comments.content,
      users.username, 
      TO_CHAR(comments.date, 'DD-MM-YYYY HH24:MI') as date_format
    FROM comments
    JOIN users ON users.id = comments.user_id
    WHERE comments.id = $1`,
    [commentId]
  );
  return commentWithUserData[0];
}

async function deleteComment(commentId) {
  await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
}

async function deleteAllPostsComments(postId) {
  await pool.query('DELETE FROM comments WHERE post_id = $1', [postId]);
}

module.exports = {
  getCommentsByPostId,
  insertComment,
  deleteComment,
  deleteAllPostsComments,
};
