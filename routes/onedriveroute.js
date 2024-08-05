const express = require('express');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const router = express.Router();
const odcred = JSON.parse(fs.readFileSync('./config/odcred.json'));
const CLIENT_ID = odcred.CLIENT_ID;
const CLIENT_SECRET = odcred.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5000/api/onedrive/redirect';
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const pool = require("../config/db.js");


function authorize() {
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=files.readwrite offline_access`;
}

router.get('/authorize', (req, res) => {
    const authUrl = authorize();
    res.json({ authUrl });
});

router.get('/redirect', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    try {
        const response = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify({
            code: code,
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const token = response.data.access_token; // Extract the access token
        // Optionally, store the token securely (e.g., in session, database, or secure cookie)
        req.session.odtoken = token;
        console.log(token);
        return res.redirect('http://localhost:5173/userdashboard'); // Adjust the URL as needed
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return res.status(500).send('Failed to exchange code for token');
    }
});

router.get('/get-token', (req, res) => {
    console.log(req.session.odtoken);
    if (req.session.odtoken) {
        res.json({ token: req.session.odtoken });
    } else {
        res.status(404).send('Token not found');
    }
});


router.post('/setSession', (req, res) => {
    console.log("SETTING SESSION");

    const { id, email, role, username } = req.body;

    if (!id || !email || !role || !username) {
        return res.status(400).json({ error: 'Missing user data' });
    }

    // Set user data in session
    req.session.user = { id, email, role, username };

    res.json({ message: 'Session set successfully', user: req.session.user });
});

router.post('/upload', upload.single('file'), async (req, res) => {
    console.log(req.session.user);
    console.log("hello");
    const token = req.body.token;
    const uid = req.body.uid;

    if (!token) {
        return res.status(401).send('Not authenticated');
    }

    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    // Extract file information from `file` object
    const originalFileName = file.originalname; // The original name of the file
    const filePath = file.path; // Path to the temporary file
    const fileSize = file.size; // Size of the file in bytes
    const fileType = file.mimetype


    try {
        const fileContents = fs.readFileSync(filePath);

        const response = await axios.put(`https://graph.microsoft.com/v1.0/me/drive/root:/${originalFileName}:/content`, fileContents, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/octet-stream'
            }
        });

        // Clean up the temporary file
        fs.unlinkSync(filePath);

        // Insert file information into the database
        const [result] = await pool.query(
            'INSERT INTO files (filename, filelocation, itemid, filesize, uid, uploaddate, keyid,filetype) VALUES (?,"onedrive", ?, ?, ?, NOW(), ?,?)', [
                originalFileName, // Use the original file name
                response.data.id, // Use the file ID from OneDrive response
                fileSize, // Use the size of the file
                req.body.uid,
                1234, // Example keyid; replace with your actual logic
                fileType
            ]
        );

        return res.status(200).json({
            message: 'File uploaded and saved to database successfully',
            driveResponse: response.data,
            dbResponse: result
        });
    } catch (error) {
        console.error('Error uploading file to OneDrive:', error);
        return res.status(500).send('Failed to upload file to OneDrive');
    }
});

module.exports = router;
