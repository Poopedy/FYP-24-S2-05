const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { is } = require('express/lib/request');
const verifyToken = require('../middlewares/authMiddleware');
const fetch = require('node-fetch'); 
const secret = 'fyp_jwt';
const File = require('../models/fileModel');

const userController = {
    register: async (req, res) => {
        try {
            const { email, username, password, role, planid } = req.body;
    
            if (!password) {
                return res.status(400).json({ error: 'Password is required.' });
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await User.create({ email, username, password: hashedPassword, role, planid });
            
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

             // Store user information in session
             req.session.user = {
                username:user.username,
                id: user.UID,
                email: user.email,
                role: user.role,
                planid: user.planid
            };
            const token = jwt.sign({ id: user.UID, username: user.username }, secret, { expiresIn: '1h' });
            res.json({ token, role: user.role, user: req.session.user });
            
        } catch (err) {
            console.error('Registration error:', err); // Log the error
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const user = await User.findByEmail(email);

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const refreshGoogleToken = async (uid) => {
                try {
                    const response = await fetch('https://cipherlink.xyz:5000/api/refresh-google', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ uid }) // Send the UID in the request body
                    });
    
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
    
                    const data = await response.json();
                    console.log('Refreshed Google Access Token:', data.accessToken);
    
                    // Handle the refreshed access token as needed
                    // For example, update your application's token storage
    
                } catch (error) {
                    console.error('Error refreshing Google access token:', error);
                }
            };

            const refreshOneDriveToken = async (uid) => {
                try {
                    const response = await fetch('https://cipherlink.xyz:5000/api/onedrive/refresh-onedrive', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ uid }) // Send the UID in the request body
                    });
            
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
            
                    const data = await response.json();
                    console.log('Refreshed OneDrive Access Token:', data.accessToken);
            
                    // Handle the refreshed access token as needed
                    // For example, update your application's token storage
            
                } catch (error) {
                    console.error('Error refreshing OneDrive access token:', error);
                }
            };

            const refreshDropboxToken = async (uid) => {
                try {
                    const response = await fetch('https://cipherlink.xyz:5000/api/dropbox/refresh-dropbox', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ uid }) // Send the UID in the request body
                    });
            
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
            
                    const data = await response.json();
                    console.log('Refreshed Dropbox Access Token:', data.accessToken);
            
                    // Handle the refreshed access token as needed
                    // For example, update your application's token storage
            
                } catch (error) {
                    console.error('Error refreshing Dropbox access token:', error);
                }
            };
            
    
            // Call the function to refresh Google token
            await refreshGoogleToken(user.UID);
            await refreshOneDriveToken(user.UID);
            await refreshDropboxToken(user.UID);

            // Store user information in session
            req.session.user = {
                username:user.username,
                id: user.UID,
                email: user.email,
                role: user.role,
                planid: user.planid
            };
            console.log(req.session.user);
            const { role } = user;
            const token = jwt.sign({ id: user.UID, username: user.username }, secret, { expiresIn: '1h' });
            res.json({ token, role: user.role, user: req.session.user });

        } catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    getAllEndUsers: async (req, res) => {
        try {
            const users = await User.getAllEndUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getProfile: async (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findByEmail(req.session.user.email);
        res.json(user);
    },

    userTest: async (req, res) => {
        console.log(req.body);
        res.send(req.body);
    },
    checkEmail: async (req, res) => {
        const { email } = req.body; 
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            const result = await User.findByEmail(email);
            if (result) {
                return res.status(200).json({ exists: true });
            }
            return res.status(200).json({ exists: false });
        } catch (error) {
            console.error('Error checking email:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    verifyEmailAndPassphrase: async (req, res) => {
        const { email, passphrase } = req.body;

        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ valid: false, message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(passphrase, user.passphrase);
            if (isMatch) {
                res.json({ valid: true });
            } else {
                res.status(401).json({ valid:false, message: 'Invalid passphrase '});
            }
        } catch (error) {
            res.status(500).json({ valid: false, message: 'Server error' });
        }
    },
    resetPassword: async (req, res) => {
        const { email, password } = req.body;
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            await User.resetPassword(email, hashedPassword);
            res.json({ message: 'Password updated successfully.' });
        } catch (error) {
            console.error('Error resetting password:', error);
            res.status(500).json({ valid: false, message: 'Server error' });
        }
    },
    getAssessRights: async (req, res) => {
        const email = req.body.email; 
        try {
        const result = await User.getRights(email);
        console.log('Result from getRights:', result); // Check the output
        res.json(result);
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
    },
    updateAccount: async (req, res) => {
        const { uid } = req.params;
        const { updatedData } = req.body;

        if (!uid) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            // Retrieve the current user data
            const currentUser = await User.findById(uid);
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Check for changes
            const updates = {};
            if (updatedData.username && updatedData.username !== currentUser.username) {
                updates.username = updatedData.username;
            }
            if (updatedData.email && updatedData.email !== currentUser.email) {
                const emailExists = await User.findByEmailAndExcludeCurrent(updatedData.email, uid);
                if (emailExists) {
                    return res.status(409).json({ message: 'Email already in use by another account' });
                }
                updates.email = updatedData.email;
            }
            if (updatedData.password) {  // Assuming password is passed hashed or needs to be hashed
                const salt = await bcrypt.genSalt();
                updates.password = await bcrypt.hash(updatedData.password, salt);
            }
    
            // If no updates, return an error
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
    
            // Perform the update
            await User.update(uid, updates);
            return res.status(200).json({ message: 'User updated successfully' });
    
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteAccount: async (req, res) => {
        const { email } = req.body; // Use destructuring to extract userId

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
	    // Get the user record based on the email
            const user = await User.findByEmail(email);
	    console.log('User found:', user); // Debugging output

            if (!user) {
               return res.status(404).json({ message: 'User not found' });
           }

           const userId = user.UID; // Extract the userId (UID)
	   console.log(userId);

           // Check if the user has files in the database using the File model
           const hasFiles = await File.checkUserFiles(userId);

          if (hasFiles) {
              return res.status(400).json({ message: 'User cannot be deleted because there are files associated with the account.' });
          }

            await User.delete(email); // Pass the userId directly
            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error('Error deleting account:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    createPassphrase: async (req, res) => {
        try {
            const { userId, passphrase } = req.body;
            await User.createPassphrase(userId, passphrase);
            res.status(201).json({ message: 'Passphrase created successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPassphrase: async (req, res) => {
        try {
            const { userId } = req.params;
            const passphrase = await User.getPassphraseByUserId(userId);
            if (passphrase) {
              res.json({ passphrase }); // Ensure passphrase is sent in the correct format
            } else {
              res.status(404).json({ error: 'Passphrase not found' });
            }
          } catch (err) {
            res.status(500).json({ error: err.message });
          }
    },

    updatePassphrase: async (req, res) => {
        try {
            const { userId, passphrase } = req.body;

            if (!userId || !passphrase) {
                return res.status(400).json({ error: 'User ID and passphrase are required.' });
            }

            // Hash the new passphrase before saving
            const salt = await bcrypt.genSalt();
            const hashedPassphrase = await bcrypt.hash(passphrase, salt);

            // Update the user's passphrase in the database
            await User.updatePassphrase(userId, hashedPassphrase);

            res.json({ message: 'Passphrase updated successfully.' });
        } catch (err) {
            console.error('Passphrase update error:', err);
            res.status(500).json({ error: err.message });
        }
    },

    deletePassphrase: async (req, res) => {
        try {
            const { userId } = req.params;
            await User.deletePassphrase(userId);
            res.json({ message: 'Passphrase deleted successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    validatePassphrase: async(req, res) => {
        try {
            const { userId, inputPassphrase } = req.body;
    
            if (!userId || !inputPassphrase) {
                return res.status(400).json({ error: 'User ID and passphrase are required' });
            }
            
            const hashedPassphrase = await User.getPassphraseByUserId(userId);
    
            if (!hashedPassphrase) {
                return res.status(404).json({ error: 'User not found or passphrase not set' });
            }
    
            // Compare the input passphrase with the hashed passphrase
            const isMatch = await bcrypt.compare(inputPassphrase, hashedPassphrase);
    
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid passphrase' });
            }
    
            res.json({ message: 'Passphrase is valid' });
        } catch (err) {
            console.error('Passphrase validation error:', err);
            res.status(500).json({ error: 'Passphrase validation failed' });
        }
    },
    createUser: async (req, res) => {
        try {
            const { email, username, password, role, planid } = req.body;
    
            if (!password) {
                return res.status(400).json({ error: 'Password is required.' });
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await User.create({ email, username, password: hashedPassword, role, planid });
            
        } catch (err) {
            console.error('Registration error:', err); // Log the error
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const currentEmail = req.params.email;
            const { username, email } = req.body;
    
            // Find the user by email
            const user = await User.findByEmail(currentEmail);
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            if (email !== currentEmail) {
                const existingUser = await User.findByEmail(email);
                if (existingUser) {
                    return res.status(409).json({ message: 'Email already in use by another account' });
                }
            }
    
            // Save the updated user
            await User.updateUser(currentEmail, email, username);
    
            res.status(200).json({ message: 'User updated successfully', user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteUser: async (req, res) => {
        const userEmail = req.params.email; // Get email from route parameters

        if (!userEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            // Get the user record based on the email
            const user = await User.findByEmail(userEmail);
            console.log('User found:', user); // Debugging output
    
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const userId = user.UID; // Extract the userId (UID)
            console.log(userId);
            // Check if the user has files in the database using the File model
            const hasFiles = await File.checkUserFiles(userId);
    
            if (hasFiles) {
                return res.status(400).json({ message: 'User cannot be deleted because there are files associated with the account.' });
            }
    
            // If no files are found, proceed to delete the user
            await User.delete(userEmail);
            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            console.error('Error deleting account:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    superupdateUser: async (req, res) => {
        const currentEmail = req.params.email;
        const updatedData = req.body;
    
        if (!currentEmail) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            // Retrieve the current user data based on email
            const currentUser = await User.findByEmail(currentEmail);
            if (!currentUser) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Check for changes
            const updates = {};
            if (updatedData.username && updatedData.username !== currentUser.username) {
                updates.username = updatedData.username;
            }
            if (updatedData.email && updatedData.email !== currentUser.email) {
                // Check if new email already exists
                const emailExists = await User.findByEmailAndExcludeCurrent(updatedData.email, currentUser.id);
                if (emailExists) {
                    return res.status(409).json({ message: 'Email already in use by another account' });
                }
                updates.email = updatedData.email;
            }
            if (updatedData.password) {  // Hash password if provided
                const salt = await bcrypt.genSalt();
                updates.password = await bcrypt.hash(updatedData.password, salt);
            }
    
            // If no updates, return an error
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
    
            // Perform the update
            await User.updateDetails(currentEmail, updates);
            return res.status(200).json({ message: 'User updated successfully' });
    
        } catch (error) {
            console.error('Error updating user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },    
    getAllAdmins: async (req, res) => {
        try {
            const users = await User.getAllAdmins();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    createAdmin: async (req, res) => {
        try {
            const { email, username, password, role, assessrights } = req.body;
    
            if (!password) {
                return res.status(400).json({ error: 'Password is required.' });
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await User.createAdmin({ email, username, password: hashedPassword, role, assessrights });
            
        } catch (err) {
            console.error('Registration error:', err); // Log the error
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },
    updateAdmin: async (req, res) => {
        const { email } = req.params;
        const { updatedData } = req.body;
    
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
    
        try {
            const currentAdmin = await User.findByEmail(email);
            if (!currentAdmin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
    
            const updates = {};
            if (updatedData.username && updatedData.username !== currentAdmin.username) {
                updates.username = updatedData.username;
            }

            if (updatedData.email && updatedData.email !== currentAdmin.email) {
                // Debugging output to check emailExists
                console.log(`Checking if email ${updatedData.email} exists for another user...`);
                const emailExists = await User.findByEmailAndExcludeCurrent(updatedData.email, currentAdmin.id);
                console.log(`Email exists: ${emailExists}`);
                if (emailExists) {
                    return res.status(409).json({ message: 'Email already in use by another account' });
                }
                updates.email = updatedData.email;
            }

            if (updatedData.password) {
                const salt = await bcrypt.genSalt();
                updates.password = await bcrypt.hash(updatedData.password, salt);
            }

            if (updatedData.assessrights && updatedData.assessrights !== currentAdmin.assessrights) {
                updates.assessrights = updatedData.assessrights;
            }
    
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'No fields to update' });
            }
    
            await User.updateDetails(email, updates);
            return res.status(200).json({ message: 'Admin updated successfully' });
    
        } catch (error) {
            console.error('Error updating admin:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }       
};

module.exports = userController;