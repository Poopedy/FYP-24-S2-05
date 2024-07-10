const mysql = require('mysql2')

// create a new MySQL connection
const pool = mysql.createPool({
    host: '54.173.173.26',
    user: '',
    password: '',
    database: '',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
  module.exports = pool.promise();
