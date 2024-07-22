const { Pool } = require('pg');

module.exports = new Pool({
  connectionString: 'postgresql://pusia:podate@localhost:5432/blogapi',
});
