const Pool = require("pg").Pool;

const pool = new Pool({
  user: 'postgres',
  password: '',
  port: 5432,
  database: 'soundcloud'
});

module.exports = pool;