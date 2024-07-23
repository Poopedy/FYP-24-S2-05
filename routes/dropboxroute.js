const express = require('express');
const axios = require('axios');
const qs = require('qs');
const fs = require('fs');
const router = express.Router();
const dbcred = JSON.parse(fs.readFileSync('./config/dbcred.json'));
const CLIENT_ID = dbcred.CLIENT_ID;
const CLIENT_SECRET = dbcred.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5000/api/dropbox/redirect';
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

function authorize() {
    return 'https://www.dropbox.com/oauth2/authorize?client_id=a60rwgu156bdp1o&redirect_uri=http://localhost:5000/api/dropbox/redirect&response_type=code&token_access_type=offline';
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
        const response = await axios.post('https://api.dropbox.com/oauth2/token', qs.stringify({
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
        console.log(token);
        //req.session.dropboxToken = token;
        // Redirect back to your frontend application
        return res.redirect('http://localhost:5173/userdashboard'); // Adjust the URL as needed
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return res.status(500).send('Failed to exchange code for token');
    }
});


router.post('/upload', upload.single('file'), async (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).send('Not authenticated');
    }

    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    try {
        const fileContents = fs.readFileSync(file.path);
        const dropboxPath = `/${file.originalname}`;

        const response = await axios.post('https://content.dropboxapi.com/2/files/upload', fileContents, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Dropbox-API-Arg': JSON.stringify({
                    path: dropboxPath,
                    mode: 'add',
                    autorename: true,
                    mute: false
                }),
                'Content-Type': 'application/octet-stream'
            }
        });

        // Clean up the temporary file
        fs.unlinkSync(file.path);

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
        return res.status(500).send('Failed to upload file to Dropbox');
    }
});

module.exports = router;