require('dotenv').config();
const Pool = require("pg").Pool;

const pool = new Pool({
  host: process.env.EC2_DB_HOST,
  user: process.env.EC2_DB_USERNAME,
  password: process.env.EC2_DB_PW,
  port: 5432,
  database: process.env.EC2_DB_NAME,
});

// hba_config
// regualar config .cont
module.exports = pool;