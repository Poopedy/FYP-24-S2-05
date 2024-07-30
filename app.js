const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors'); // Import CORS middleware
const dropboxRoutes = require('./routes/dropboxroute');
const app = express();
const session = require('express-session');
const MySQLStore = require('connect-mysql-session')(session);

const dbOptions = {
    host: 'localhost',
    user: 'root',
    password: 'Poopedy11_',
    database: 'fyp_database',
    port: 3306,
};

const sessionStore = new MySQLStore(dbOptions);

app.use(session({
    key: 'user_sid',
    secret: 'fyp11',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// Set up multer for parsing form-data
const upload = multer();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse form-data
app.use(upload.none());

app.use('/api', userRoutes);
app.use('/api/dropbox', dropboxRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});