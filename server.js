// npm i express bcrypt
// npm i --save-dev nodemon
// install vs code ext rest client


const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql2/promise')

app.use(express.json())

// create a new MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Poopedy11_',
  database: 'fyp_database',
}).promise();

// Middleware to validate user input
function validateUserInput(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  next();
}

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
app.post('/users', validateUserInput, async (req, res) => {
  try {
    const { email, username, password, role, planid } = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = 'INSERT INTO users (email, username, password, role, planid) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [email, username, hashedPassword, role, planid]);

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
app.post('/users/login',validateUserInput, async (req, res) => {
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

app.listen(3000, () => {
  console.log('Server is running on port 3000')
}) 