const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const userRoutes = require('./routes/userRoutes');
const dropboxRoutes = require('./routes/dropboxroute');
const cors = require('cors'); // Import CORS middleware

const app = express();

// Set up multer for parsing form-data
//const upload = multer();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse form-data
//app.use(upload.none());

app.use('/api', userRoutes);
app.use('/api/dropbox', dropboxRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});