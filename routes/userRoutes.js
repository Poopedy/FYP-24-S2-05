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

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', verifyToken, userController.getAllUsers);
router.post('/usertest', userController.userTest);
router.get('/profile', userController.getProfile);

// routes for passphrase CRUD operations
router.post('/passphrase', verifyToken, userController.createPassphrase);
router.get('/passphrase/:userId', verifyToken, userController.getPassphrase);
router.put('/passphrase', verifyToken, userController.updatePassphrase);
router.delete('/passphrase/:userId', verifyToken, userController.deletePassphrase);

router.post('/saveEncryptionKey', verifyToken, userController.saveEncryptionKey);

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
    res.redirect('https://localhost:5173/userdashboard')
  });

router.get('/getAuthURL', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE,
    });
    console.log(authUrl);
    return res.send(authUrl);
});

router.post('/getToken', (req, res) => {
    console.log("ENTERED")
    if (req.body.code == null) return res.status(400).send('Invalid Request');
    var code = decodeURIComponent(req.body.code)
    console.log(code)
    oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(400).send('Error retrieving access token');
        }
        res.send(token);
        return token;
    });

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

// Specify the directory where files will be uploaded

router.post('/fileUpload', upload.single('file'), (req, res) => {
  if (!req.body.token) {
      return res.status(400).send('Token not found');
  }

  const token = JSON.parse(req.body.token);
  oAuth2Client.setCredentials(token);

  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  const fileMetadata = {
      name: req.file.originalname,
  };
  const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
  };

  drive.files.create(
      {
          resource: fileMetadata,
          media: media,
          fields: 'id',
      },
      (err, file) => {
          oAuth2Client.setCredentials(null);
          fs.unlink(req.file.path, (unlinkErr) => {
              if (unlinkErr) {
                  console.error(unlinkErr);
              }
          });

          if (err) {
              console.error(err);
              return res.status(400).send(err);
          } else {
              res.send('Successful');
              console.log("Success")
          }
      }
  );
});

router.post('/deleteFile/:id', (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found');
    oAuth2Client.setCredentials(req.body.token);
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    var fileId = req.params.id;
    drive.files.delete({ 'fileId': fileId }).then((response) => { res.send(response.data) })
});

router.post('/download/:id', (req, res) => {
    if (req.body.token == null) return res.status(400).send('Token not found');
    oAuth2Client.setCredentials(req.body.token);
    const drive = google.drive({ version: 'v3', auth: oAuth2Client });
    var fileId = req.params.id;
    drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' },
        function (err, response) {
            response.data
                .on('end', () => {
                    console.log('Done');
                })
                .on('error', err => {
                    console.log('Error', err);
                })
                .pipe(res);
        });

});

module.exports = router;

module.exports = router;