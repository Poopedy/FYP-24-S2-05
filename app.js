const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const userRoutes = require('./routes/userRoutes');
const planRoutes = require('./routes/plansRoutes');
const fileRoutes = require('./routes/fileRoutes');
const keyRoutes = require('./routes/keyRoutes');
const cors = require('cors'); // Import CORS middleware
const dropboxRoutes = require('./routes/dropboxroute');
const onedriveRoutes = require('./routes/onedriveroute');
const https = require('https'); // Import https module
const fs = require('fs'); // Import file system module
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const dbOptions = {
    host: 'localhost',
    user: 'fyp_user',
    password: 'password',
    database: 'CIPHERLINK',
    port: 3306,
};

const sessionStore = new MySQLStore(dbOptions);

const app = express();

app.use(session({
    key: 'user_sid',
    secret: 'fyp11',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Set to true for HTTPS
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
//app.use(upload.none());

app.use('/api', keyRoutes);
app.use('/api', fileRoutes);
app.use('/api', planRoutes);
app.use('/api', userRoutes);
app.use('/api/dropbox', dropboxRoutes);
app.use('/api/onedrive', onedriveRoutes);

// Read SSL certificate and key
const sslOptions = {
    key: fs.readFileSync('privatekey.pem'),
    cert: fs.readFileSync('cipherlink_xyz.pem')
};

const PORT = process.env.PORT || 5000;

// Create HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});
