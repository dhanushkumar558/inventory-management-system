require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false },
  max: 20, // ✅ Increase or set your own pool limit
  idleTimeoutMillis: 30000, // optional: close idle connections after 30s
  connectionTimeoutMillis: 5000, // optional: fail if can't connect in 2s
});


module.exports = pool;
