// npm i express bcrypt
// npm i --save-dev nodemon
// install vs code ext rest client


const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

// user database
const users = []

app.get('/users', (req, res) => {
    res.json(users)
})

// post username and password from frontend, create user
app.post('/users', async (req, res) => {
    try {
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(req.body.password, salt)
      const user = { name: req.body.name, password: hashedPassword }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })

  // user login taking in username and password
app.post('/users/login', async (req, res) => {
    // check if user exist in db
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        // compare pw from post with db, user is from db
        if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
        } else {
        res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})


app.listen(3000)