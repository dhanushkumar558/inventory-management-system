const { Pool } = require('pg');

const pool = new Pool({
  user: 'dhanush',
  host: 'localhost',
  database: 'inventory',
  password: 'root123!',
  port: 5432,
});

module.exports = pool;
