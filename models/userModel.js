const db = require('../config/db');

const User = {
    create: async (data) => {
        const sql = 'INSERT INTO users (email, username, password, role, planid) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [data.email, data.username, data.password, data.role, data.planid]);
    },
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },
    createPassphrase: async (userId, passphrase) => {
        const sql = 'INSERT INTO users (UID, passphrase) VALUES (?, ?)';
        await db.query(sql, [userId, passphrase]);
    },
    getPassphraseByUserId: async (userId) => {
        const [rows] = await db.query('SELECT passphrase FROM users WHERE UID = ?', [userId]);
        return rows[0] ? rows[0].passphrase : null;
    },
    updatePassphrase: async (userId, passphrase) => {
        const sql = 'UPDATE users SET passphrase = ? WHERE UID = ?';
        await db.query(sql, [passphrase, userId]);
    },
    deletePassphrase: async (userId) => {
        const sql = 'DELETE FROM users WHERE UID = ?';
        await db.query(sql, [userId]);
    }
};

module.exports = User;