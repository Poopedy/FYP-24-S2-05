// npm i express bcrypt
// npm i --save-dev nodemon
// install vs code ext rest client

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secret = 'fyp_jwt'; // Use a secure secret for JWT

// test

app.post('/usertest', async (req, res) => {
    console.log(req.body);
    res.send(req.body)
  });

// end test

// get all users for testing
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Login Route
app.post('/users/login', async (req, res) => {
  const { username , password  } = req.body;
  
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
      const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
      
      if (rows.length === 0) {
        
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = rows[0];
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const token = jwt.sign({ id: user.UID, username: user.username }, secret, { expiresIn: '1h' });

      res.json({ token });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});



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


// Register a new user
app.post('/users/register', async (req, res) => {
  try {
    
    
    const { email, username, password, role, planid } = req.body;
    // Log incoming data
    if (password == null){
      return res.status(400).json({ error: 'Password is null.' });
    }
    
    // Check that password is provided
    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }
    const salt = await bcrypt.genSalt();
    console.log(`Generated salt: ${salt}`);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`Hashed password: ${hashedPassword}`);

    const sql = 'INSERT INTO users (email, username, password, role, planid) VALUES (?, ?, ?, ?, ?)';
    await db.query(sql, [email, username, hashedPassword, role, planid]);
    console.log(`Insert result: ${JSON.stringify(sql)}`);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});