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
const pool = require("../config/db.js");
const verifyToken = require('../middlewares/authMiddleware');
const { encryptCloud, decryptCloud } = require('./encrypthelper');

// function authorize() {
//     return 'https://www.dropbox.com/oauth2/authorize?client_id=a60rwgu156bdp1o&redirect_uri=http://localhost:5000/api/dropbox/redirect&response_type=code&token_access_type=offline';
// }

// router.get('/authorize', (req, res) => {
//     const authUrl = authorize();
//     res.json({ authUrl });
// });

// router.get('/redirect', async (req, res) => {
//     const code = req.query.code;
//     if (!code) {
//         return res.status(400).send('Authorization code not provided');
//     }

//     try {
//         const response = await axios.post('https://api.dropbox.com/oauth2/token', qs.stringify({
//             code: code,
//             grant_type: 'authorization_code',
//             client_id: CLIENT_ID,
//             client_secret: CLIENT_SECRET,
//             redirect_uri: REDIRECT_URI
//         }), {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         });

//         const token = response.data.access_token; // Extract the access token
//         // Optionally, store the token securely (e.g., in session, database, or secure cookie)
//         console.log(token);
//         //req.session.dropboxToken = token;
//         // Redirect back to your frontend application
//         return res.redirect('http://localhost:5173/userdashboard'); // Adjust the URL as needed
//     } catch (error) {
//         console.error('Error exchanging code for token:', error);
//         return res.status(500).send('Failed to exchange code for token');
//     }
// });


function authorize(uid) {
    return `https://www.dropbox.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&token_access_type=offline&state=${uid}`;
}

router.get('/authorize', (req, res) => {
    const uid = req.query.uid;
    if (!uid) {
        return res.status(400).send('User ID not provided');
    }

    const authUrl = authorize(uid);
    res.json({ authUrl });
});

router.get('/redirect', async (req, res) => {
    const code = req.query.code;
    const uid = req.query.state; // Retrieve the UID from the state parameter
    console.log(uid);
    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    if (!uid) {
        return res.status(400).send('User ID not provided');
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

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        console.log(accessToken);
        console.log(refreshToken);
        //Insert token and refresh token into the database
        await pool.query(
            'INSERT INTO cloud (uid, cloudservice, accesstoken, refreshtoken) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE accesstoken = VALUES(accesstoken), refreshtoken = VALUES(refreshtoken)',
            [uid, "dropbox", encryptCloud(accessToken), encryptCloud(refreshToken)]
        );

        return res.redirect('http://localhost:5173/userdashboard'); // Adjust the URL as needed
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return res.status(500).send('Failed to exchange code for token');
    }
});


router.post('/upload', upload.single('file'), async (req, res) => {
    const token = req.body.token;
    const uid = req.body.uid;

    if (!token) {
        return res.status(401).send('Not authenticated');
    }

    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded');
    }

    const filePath = file.path;
    const fileName = file.originalname;
    const fileSize = file.size; // Size in bytes
    const fileType = file.mimetype

    try {
        // Upload file to Dropbox
        const fileContents = fs.readFileSync(filePath);
        const dropboxPath = `/${fileName}`;

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

        // Extract Dropbox file ID from response
        const dropboxFileId = response.data.id;

        // Insert file information into the database
        const [result] = await pool.query(
            'INSERT INTO files (filename, filelocation, itemid, filesize, uid, uploaddate, keyid, filetype) VALUES (?,"dropbox", ?, ?, ?, NOW(), ?,?)', [
                fileName,
                dropboxFileId, // Using Dropbox file ID as filelocation
                fileSize,
                uid,
                1234,
                fileType
            ]
        );

        // Clean up the temporary file
        fs.unlinkSync(filePath);

        return res.status(200).json({
            message: 'File uploaded and saved to database successfully',
            dropboxResponse: response.data,
            dbResponse: result
        });
    } catch (error) {
        console.error('Error uploading file to Dropbox:', error);
        return res.status(500).send('Failed to upload file to Dropbox');
    }
});

// Delete file route
router.post('/dropbox/deleteFile/:path', (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found');
    const dbx = new Dropbox({ accessToken: req.body.token });
    const filePath = req.params.path;

    dbx.filesDeleteV2({ path: filePath })
        .then(() => res.send({ message: 'File deleted successfully' }))
        .catch(error => {
            console.error('Error deleting file:', error);
            res.status(500).send('Failed to delete file');
        });
});

// Download file route
router.post('/dropbox/download/:path', (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found');
    const dbx = new Dropbox({ accessToken: req.body.token });
    const filePath = req.params.path;

    dbx.filesDownload({ path: filePath })
        .then(response => {
            res.setHeader('Content-Disposition', `attachment; filename=${response.name}`);
            response.fileBlob.stream().pipe(res);
        })
        .catch(error => {
            console.error('Error downloading file:', error);
            res.status(500).send('Failed to download file');
        });
});

router.post('/refresh-dropbox', async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).send('User ID is required');
    }

    try {
        // Retrieve the refresh token from the database
        const [rows] = await pool.query('SELECT refreshtoken FROM cloud WHERE uid = ? AND cloudservice = ?', [uid, 'dropbox']);
        if (rows.length === 0) {
            throw new Error('Refresh token not found');
        }

        const refreshToken = decryptCloud(rows[0].refreshtoken);

        // Dropbox token URL and client credentials
        const TOKEN_URL = 'https://api.dropbox.com/oauth2/token';

        // Request a new access token
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update the access token and refresh token in the database
        await pool.query('UPDATE cloud SET accesstoken = ? WHERE uid = ? AND cloudservice = ?', [
            encryptCloud(access_token),
            uid,
            'dropbox'
        ]);

        res.json({ accessToken: access_token });
    } catch (error) {
        console.error('Error refreshing Dropbox access token:', error);
        res.status(500).send('Failed to refresh access token');
    }
});
module.exports = router;