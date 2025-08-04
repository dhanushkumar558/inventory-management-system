const { Pool } = require('pg');

const pool = new Pool({
  user: 'avnadmin',
  host: 'pg-e2eef21-dhanushkumar558-b8b4.i.aivencloud.com',
  database: 'defaultdb',
  password: 'AVNS_KxCtcF3dEko0QoZZQcv',
  port: 11283,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
