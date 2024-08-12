const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { google } = require('googleapis');
const credentials = require('../config/credentials.json');
const client_id = credentials.web.client_id;
const formidable = require('formidable');
const multer = require('multer');
const fs = require("fs");
const client_secret = credentials.web.client_secret;
const redirect_uris = credentials.web.redirect_uris;
const upload = multer({ dest: 'uploads/' }); 
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
const SCOPE = ['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive.file']
const verifyToken = require('../middlewares/authMiddleware');
const axios = require('axios');
const { encryptCloud, decryptCloud } = require('./encrypthelper');
const pool = require("../config/db.js");
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const fetch = require('node-fetch'); // Ensure you have 'node-fetch' installed or use the native 'fetch' if supported in your environment
const { PassThrough } = require('stream');const { verify } = require('crypto');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', verifyToken, userController.getAllEndUsers);
router.post('/usertest', userController.userTest);
router.get('/profile', userController.getProfile);
router.post('/checkExistence', userController.checkEmail);
router.put('/updateAccount/:uid', verifyToken, userController.update);
router.post('/deleteAccount', verifyToken, userController.delete);
router.post('/verify', userController.verifyEmailAndPassphrase);
router.post('/resetPassword', userController.resetPassword);
router.post('/getAssessRights', verifyToken, userController.getAssessRights);

// routes for passphrase CRUD operations
router.post('/passphrase', verifyToken, userController.createPassphrase);
router.get('/passphrase/:userId', verifyToken, userController.getPassphrase);
router.put('/passphrase', verifyToken, userController.updatePassphrase);
router.delete('/passphrase/:userId', verifyToken, userController.deletePassphrase);
router.post('/validatePassphrase', verifyToken, userController.validatePassphrase);

// routes for admin and super admin
router.post('/admin/updateUser/:email', verifyToken, userController.updateUser);
router.delete('/admin/:email', verifyToken, userController.deleteUser);
router.post('/admin/createUser', verifyToken, userController.createUser);
router.get('/admins', verifyToken, userController.getAllAdmins);
router.put('/superadmin/updateAdmin/:email', verifyToken, userController.updateAdmin);
router.post('/superadmin/createAdmin', verifyToken, userController.createAdmin);
router.post('/superadmin/superupdateUser/:email', verifyToken, userController.superupdateUser);

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        res.clearCookie('user_sid');
        res.json({ message: 'Logout successful' });
    });
});

router.get('/', (req, res) => res.send(' API Running'));
router.get('/userdashboard', (req, res) => {
    // Handle the request, e.g., render a page or send JSON data
    res.redirect('https://cipherlink.xyz/userdashboard')
  });

router.get('/getAuthURL', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE,
    });
    console.log(authUrl);
    return res.send(authUrl);
});

router.post('/getToken', async (req, res) => {
    console.log("ENTERED");

    // Check if the code and uid are provided
    if (!req.body.code || !req.body.uid) {
        return res.status(400).send('Invalid Request');
    }

    const code = decodeURIComponent(req.body.code);
    const uid = req.body.uid; // Retrieve UID from the request body

    console.log(`Code: ${code}, UID: ${uid}`);

    try {
        // Exchange the code for an access token
        const { tokens } = await oAuth2Client.getToken(code);

        // Log the token (optional)
        console.log('Access token:', tokens);

        // Here, you would insert or update the token in your database
        // Example for MySQL:
        await pool.query(
            'INSERT INTO cloud (uid, cloudservice, accesstoken, refreshtoken) VALUES (?, ?, ?, ?) ' +
            'ON DUPLICATE KEY UPDATE accesstoken = VALUES(accesstoken), refreshtoken = VALUES(refreshtoken)',
            [uid, 'gdrive', encryptCloud(tokens.access_token), encryptCloud(tokens.refresh_token)]
        );

        // Send the token back in the response
        res.send(tokens.access_token);
    } catch (err) {
        console.error('Error retrieving access token', err);
        res.status(400).send('Error retrieving access token');
    }
});


router.post('/getUserInfo', (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found');
    oAuth2Client.setCredentials(JSON.parse(req.body.token));
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });

    oauth2.userinfo.get((err, response) => {
        if (err) res.status(400).send(err);
        console.log(response.data);
        res.send(response.data);
    })
});

router.post('/readDrive', (req, res) => {
    console.log(req.session.user);
    if (req.body.token == null) return res.status(400).send('Token not found');
    oAuth2Client.setCredentials(JSON.parse(req.body.token));
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    drive.files.list({
        pageSize: 10,
    }, (err, response) => {
        if (err) {
            console.log('The API returned an error: ' + err);
            return res.status(400).send(err);
        }
        const files = response.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
        res.send(files);
    });
});

router.post('/fileUpload', upload.single('file'), async (req, res) => {
    if (!req.body.token) {
        return res.status(400).send('Token not found');
    }
    if (!req.body.keyid) {
        return res.status(400).send('Key ID not found');
    }
    const uid = req.body.uid;
    const token = req.body.token; // Directly use the access token
    const keyId = req.body.keyid;
    oAuth2Client.setCredentials({ access_token: token });

    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    const fileMetadata = {
        name: req.file.originalname,
    };
    const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
    };

    try {
        // Upload the file to Google Drive
        const driveResponse = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        // Extract necessary file details
        const fileId = driveResponse.data.id;
        const fileName = req.file.originalname;
        const fileSize = req.file.size;
        const fileType = req.file.mimetype;

        // Clean up the temporary file
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error('Failed to delete temporary file:', unlinkErr);
            }
        });

        // Insert file information into the database
        const [result] = await pool.query(
            'INSERT INTO files (filename, filelocation, itemid, filesize, uid, uploaddate, keyid, filetype) VALUES (?, "drive", ?, ?, ?, NOW(), ?, ?)', [
                fileName,
                driveResponse.data.id,
                fileSize,
                uid,
                keyId, // Assuming keyid is the fileId in this case; adjust if needed
                fileType
            ]
        );

        // Send a success response
        res.status(200).json({
            message: 'File uploaded to Google Drive and saved to database successfully',
            driveFileId: fileId,
            dbResponse: result
        });
        console.log('Success:', fileId);

    } catch (error) {
        console.error('Error uploading file to Google Drive:', error);
        res.status(500).send('Failed to upload file to Google Drive');
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
        // Delete file from Google Drive
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log(`Failed to delete file from Google Drive: ${response.status}`);
            return res.status(response.status).send('Failed to delete file from Google Drive');
        }

        // Delete file record from database
        const deleteResult = await pool.query(
            'DELETE FROM files WHERE uid = ? AND itemid = ?', [uid, fileId]
        );

        if (deleteResult.affectedRows === 0) {
            console.log('No record found in the database to delete.');
            return res.status(404).send('File record not found in database');
        }

        console.log(`File with ID ${fileId} deleted successfully from both Google Drive and database.`);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).send('Failed to delete file');
    }
});


router.get('/download/:id', async (req, res) => {
    console.log("Endpoint reached");

    // Check if token is present
    if (!req.query.token) return res.status(400).send('Token not found');
    
    const fileId = req.params.id;
    const token = req.query.token;
    
    try {
        // Fetch the file metadata to get the original filename and extension
        const metadataResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name,mimeType`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!metadataResponse.ok) {
            return res.status(metadataResponse.status).send('Failed to retrieve file metadata');
        }

        const metadata = await metadataResponse.json();
        const fileName = metadata.name; // This is the original filename with extension
        const mimeType = metadata.mimeType || 'application/octet-stream'; // Get the MIME type from the metadata
        console.log(`File Name from Metadata: ${fileName}`);

        // Fetch the file content
        const fileResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (fileResponse.ok) {
            // Set the appropriate headers with the correct filename and MIME type
            res.setHeader('Content-Type', mimeType);
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

router.post('/getFilesByUid', verifyToken, async (req, res) => {
    const uid = req.userId; // Extracted from the verified token

    try {
        const [rows] = await pool.query('SELECT * FROM files WHERE uid = ?', [uid]);
        return res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching files:', error);
        return res.status(500).json({ error: 'Failed to fetch files' });
    }
});

router.post('/refresh-google', async (req, res) => {
    const { uid } = req.body;
    if (!uid) {
        return res.status(400).send('User ID is required');
    }

    try {
        // Retrieve the refresh token from the database
        const [rows] = await pool.query('SELECT refreshtoken FROM cloud WHERE uid = ? AND cloudservice = ?', [uid, 'gdrive']);
        if (rows.length === 0) {
            throw new Error('Refresh token not found');
        }

        const refreshToken = decryptCloud(rows[0].refreshtoken);

        // Request a new access token
        const response = await axios.post(TOKEN_URL, new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: client_id,
            client_secret: client_secret
        }).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update the access token and refresh token in the database
        await pool.query('UPDATE cloud SET accesstoken = ? WHERE uid = ? AND cloudservice = ?', [
            encryptCloud(access_token),
            uid,
            'gdrive'
        ]);

        res.json({ accessToken: access_token });
    } catch (error) {
        console.error('Error refreshing Google access token:', error);
        res.status(500).send('Failed to refresh access token');
    }
});
// router.post('/gettokens', verifyToken, async (req, res) => {
//     try {
//         const uid = req.userId; // UID extracted from JWT

//         // Fetch cloud information for the given UID
//         const [rows] = await pool.query(
//             'SELECT * FROM cloud WHERE uid = ?',
//             [uid]
//         );

//         if (rows.length === 0) {
//             return res.status(404).send('No cloud records found for this user');
//         }

//         res.json(rows);
//     } catch (error) {
//         console.error('Error fetching cloud information:', error);
//         res.status(500).send('Server error');
//     }
// });


router.post('/gettokens', verifyToken, async (req, res) => {
    try {
        const uid = req.userId; // UID extracted from JWT

        // Fetch cloud information for the given UID
        const [rows] = await pool.query(
            'SELECT * FROM cloud WHERE uid = ?',
            [uid]
        );

        if (rows.length === 0) {
            return res.status(404).send('No cloud records found for this user');
        }

        // Decrypt the tokens before returning them
        const decryptedRows = rows.map(row => ({
            ...row,
            accesstoken: decryptCloud(row.accesstoken),
            refreshtoken: decryptCloud(row.refreshtoken),
        }));

        res.json(decryptedRows);
    } catch (error) {
        console.error('Error fetching cloud information:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
