const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { is } = require('express/lib/request');
const verifyToken = require('../middlewares/authMiddleware');
const secret = 'fyp_jwt';

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

    getAllUsers: async (req, res) => {
        try {
            const users = await User.getAll();
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
    update: async (req, res) => {
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
    delete: async (req, res) => {
        const { email } = req.body; // Use destructuring to extract userId

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            await User.delete(email); // Pass the userId directly
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
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
};

module.exports = userController;