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
            res.status(201).json({ message: 'User registered successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
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
            const { role } = user;
            const token = jwt.sign({ id: user.UID, username: user.username }, secret, { expiresIn: '1h' });
            res.json({ token, role: user.role });

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

    userTest: async (req, res) => {
        console.log(req.body);
        res.send(req.body);
    }
};

module.exports = userController;