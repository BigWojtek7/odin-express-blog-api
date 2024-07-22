const { Client } = require('pg');

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 ),
  password VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  users_id integer,
  title VARCHAR ( 255 ),
  content VARCHAR ( 255 ),
  date TIMESTAMPTZ,
  FOREIGN KEY (users_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  users_id integer,
  posts_id integer,
  content VARCHAR ( 255 ),
  date TIMESTAMPTZ,
  FOREIGN KEY (users_id) REFERENCES users(id),
  FOREIGN KEY (posts_id) REFERENCES posts(id)
);
`;





// const SQL2 =`CREATE TABLE IF NOT EXISTS post (
//   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
//   user_id integer,
//   title VARCHAR ( 255 ),
//   content VARCHAR ( 255 ),
//   date TIMESTAMPTZ,
//   FOREIGN KEY (user_id) REFERENCES usernames(id)
// );`

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: mongoDB,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
