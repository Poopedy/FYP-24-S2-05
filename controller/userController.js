const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Key = require('../models/keyModel')
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
                id: user.UID,
                email: user.email,
                role: user.role,
            };

            // Generate a token for the user
            const token = jwt.sign({ id: user.UID, username: user.username }, secret, { expiresIn: '1h' });
    
            // Return user info and token
            res.status(201).json({
                token,
                role: user.role,
                user: {
                    id: user.UID,
                    email: user.email,
                    username: user.username
                }
            });
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
                id: user.UID,
                email: user.email,
                role: user.role,
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
            res.json(passphrase);
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
            await User.updatePassphrase(hashedPassphrase, userId);

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

    saveEncryptionKey: async (req, res) => {
        try {
            const { userId, encryptedKey } = req.body;
            if (!userId || !encryptedKey) {
                return res.status(400).json({ error: 'User ID and encrypted key are required.' });
            }
            await Key.create(userId, encryptedKey);
            res.json({ message: 'Encryption key created successfully.' });
        } catch (err) {
            res.status(500).json({ message: 'Encryption key error' });
        }
    }
};

module.exports = userController;