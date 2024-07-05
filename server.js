// npm i express bcrypt
// npm i --save-dev nodemon
// install vs code ext rest client


const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')

app.use(express.json())
app.use(bodyParser.json())
// create a new MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Poopedy11_',
  database: 'fyp_database'
});

// connect to MySql
// pool.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySql: ' + err.stack);
//     return;
//   }
//   console.log('Connect to MySql as ID' + pool.threadID);
// });

// Middleware to validate user input
// function validateUserInput(req, res, next) {
//   const { email, username, password, role, planid } = req.body;
//   if (!email || !username || !password || !role || !planid) {
//     console.log(`Received data: ` + req.body.email);
//     console.log(`Received data: ${JSON.stringify(req.body.username)}`);
//     console.log(`Received data: ${JSON.stringify(password)}`);
//     console.log(`Received data: ${JSON.stringify(role)}`);
//     console.log(`Received data: ${JSON.stringify(planid)}`);
//     return res.status(400).json({ error: 'All fields are required.' });
//   }
//   next();
// }

// // Fetch all users (for testing purposes, not recommended for production)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT username FROM users')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Register a new user
app.post('/createuser', async (req, res) => {
  try {
    const { email, username, password, role, planid } = req.body;
    // Log incoming data
    console.log(`Received data: ${JSON.stringify(req.body)}`);
    // Check that password is provided
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }
    const salt = await bcrypt.genSalt();
    console.log(`Generated salt: ${salt}`);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`Hashed password: ${hashedPassword}`);

    const sql = 'INSERT INTO users (email, username, password, role, planid) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [email, username, hashedPassword, role, planid]);
    console.log(`Insert result: ${JSON.stringify(result)}`);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
app.post('/userlogin', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [req.body.username])
    const user = rows[0]

    if (!user) {
      return res.status(400).send('Cannot find user')
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});