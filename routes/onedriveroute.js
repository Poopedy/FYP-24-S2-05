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
const { encryptCloud, decryptCloud } = require('./encrypthelper');
const { Client } = require('@microsoft/microsoft-graph-client');
const fetch = require('node-fetch');

function authorize(uid) {
    return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=files.readwrite offline_access&state=${uid}`;
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

    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    if (!uid) {
        return res.status(400).send('User ID not provided');
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

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Insert the access token and refresh token into the database
        await pool.query(
            'INSERT INTO cloud (uid, cloudservice, accesstoken, refreshtoken) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE accesstoken = VALUES(accesstoken), refreshtoken = VALUES(refreshtoken)',
            [uid, "onedrive", encryptCloud(accessToken), encryptCloud(refreshToken)]
        );

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
    const keyId = req.body.keyid;

    if (!token) {
        return res.status(401).send('Not authenticated');
    }

    if (!keyId) {
        return res.status(400).send('Key ID not found');
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

    console.log(originalFileName);

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
                uid,
                keyId, // Example keyid; replace with your actual logic
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

// Download file route
// router.get('/download/:id', async (req, res) => {
//     console.log("Endpoint reached");

//     // Check if token is present
//     if (!req.query.token) return res.status(400).send('Token not found');
    
//     const fileId = req.params.id;
//     const token = req.query.token;
//     console.log(token);
    
//     try {
//         // Fetch the file metadata to get the original filename and extension
//         const metadataResponse = await fetch('https://api.dropboxapi.com/2/files/get_metadata', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 "path": fileId
//             })
//         });

//         if (!metadataResponse.ok) {
//             return res.status(metadataResponse.status).send('Failed to retrieve file metadata');
//         }

//         const metadata = await metadataResponse.json();
//         const fileName = metadata.name; // This is the original filename with extension
//         console.log(`File Name from Metadata: ${fileName}`);

//         // Fetch the file content
//         const fileResponse = await fetch('https://content.dropboxapi.com/2/files/download', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Dropbox-API-Arg': JSON.stringify({ "path": fileId })
//             }
//         });

//         if (fileResponse.ok) {
//             // Create a PassThrough stream
//             const passThrough = new PassThrough();

//             // Set the appropriate headers
//             res.setHeader('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
//             res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

//             // Pipe the file response through the PassThrough stream
//             fileResponse.body.pipe(passThrough).pipe(res);

//         } else {
//             console.log(fileResponse);
//             res.status(fileResponse.status).send('Failed to download file');
//         }
//     } catch (error) {
//         console.error('Error downloading file:', error);
//         res.status(500).send('Failed to download file');
//     }
// });
router.get('/download/:id', async (req, res) => {
    console.log("Endpoint reached");

    // Check if token is present
    if (!req.query.token) return res.status(400).send('Token not found');
    
    const fileId = req.params.id;
    const token = req.query.token;
    
    try {
        // Fetch the file metadata to get the original filename and extension
        const metadataResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!metadataResponse.ok) {
            return res.status(metadataResponse.status).send('Failed to retrieve file metadata');
        }

        const metadata = await metadataResponse.json();
        const fileName = metadata.name; // This is the original filename with extension
        console.log(`File Name from Metadata: ${fileName}`);

        // Fetch the file content
        const fileResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (fileResponse.ok) {
            // Set the appropriate headers with the correct filename
            res.setHeader('Content-Type', fileResponse.headers.get('Content-Type') || 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            
            // Pipe the file stream directly to the HTTP response
            fileResponse.body.pipe(res);
        } else {
            console.log(fileResponse);
            res.status(fileResponse.status).send('Failed to download file');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Failed to download file');
    }
});


router.delete('/delete/:id', async (req, res) => {
    console.log("Delete endpoint reached");

    const token = req.body.token;
    const fileId = req.params.id;
    const uid = req.body.uid;  // Use request body to get the user ID

    if (!token) return res.status(400).send('Token not found');
    if (!uid) return res.status(400).send('User ID not provided');

    try {
        // Delete file from OneDrive
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log(`Failed to delete file from OneDrive: ${response.status}`);
            return res.status(response.status).send('Failed to delete file from OneDrive');
        }

        // Delete file record from database
        const deleteResult = await pool.query(
            'DELETE FROM files WHERE uid = ? AND itemid = ?', [uid, fileId]
        );

        if (deleteResult.affectedRows === 0) {
            console.log('No record found in the database to delete.');
            return res.status(404).send('File record not found in database');
        }

        console.log(`File with ID ${fileId} deleted successfully from both OneDrive and database.`);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).send('Failed to delete file');
    }
});



router.post('/refresh-onedrive', async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).send('User ID is required');
    }

    try {
        // Retrieve the refresh token from the database
        const [rows] = await pool.query('SELECT refreshtoken FROM cloud WHERE uid = ? AND cloudservice = ?', [uid, 'onedrive']);
        if (rows.length === 0) {
            throw new Error('Refresh token not found');
        }

        const refreshToken = decryptCloud(rows[0].refreshtoken);

        // OneDrive token URL and client credentials
        const TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

        // Request a new access token
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            scope: 'https://graph.microsoft.com/.default'
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update the access token and refresh token in the database
        await pool.query('UPDATE cloud SET accesstoken = ? WHERE uid = ? AND cloudservice = ?', [
            encryptCloud(access_token),
            uid,
            'onedrive'
        ]);

        res.json({ accessToken: access_token });
    } catch (error) {
        console.error('Error refreshing OneDrive access token:', error);
        res.status(500).send('Failed to refresh access token');
    }
});


module.exports = router;
