const pool = require('../pool');

async function getUsername(userId) {
  const { rows } = await pool.query('SELECT username FROM users WHERE id=$1', [
    userId,
  ]);
  return rows;
}

async function insertUser(username, password) {
  await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [
    username,
    password,
  ]);
}

async function getUser(username) {
  const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [
    username,
  ]);
  return rows;
}

module.exports = {
  getUsername,
  insertUser,
  getUser,
};
