const pool = require('../pool');

async function getAllPosts() {
  const { rows } = await pool.query('SELECT * FROM posts');
  return rows;
}

async function getSinglePost(postId) {
  const { rows } = await pool.query('SELECT * FROM posts WHERE id = $1', [
    postId,
  ]);
  return rows;
}

async function insertPost(title, content, date, user) {
  await pool.query(
    'INSERT INTO posts(title, content, date, user) VALUES($1, $2, $3, $4)',
    [title, content, date, user]
  );
}

async function deletePost(postId) {
  await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
}

module.exports = {
  getAllPosts,
  getSinglePost,
  insertPost,
  deletePost,
};
