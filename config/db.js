const mysql = require('mysql2')

// create a new MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'fyp_user',
    password: 'password',
    database: 'CIPHERLINK',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  module.exports = pool.promise();
