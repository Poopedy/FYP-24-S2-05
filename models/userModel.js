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
    findById: async (userId) => {
        const [rows] = await db.query('SELECT * FROM users WHERE uid = ?', [userId]);
        return rows.length > 0;
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },
    findByEmailAndExcludeCurrent: async (email, uid) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND uid != ?', [email, uid]);
        return rows.length > 0;
    },   
    resetPassword: async (email, password) => {
        const sql = 'UPDATE users SET password = ? WHERE email = ?';
        await db.query(sql, [password, email]);
    },
    update: async (uid, updateData) => {
        const fields = [];
        const values = [];
        
        // Construct the SQL query dynamically based on the fields present in updateData
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined && value !== null) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        // Construct the SQL query
        const query = `UPDATE users SET ${fields.join(', ')} WHERE uid = ?`;
        values.push(uid); // Add user ID as the last parameter

        try {
            // Execute the query
            const [result] = await db.query(query, values);
            return result;
        } catch (error) {
            console.error('Error updating user in database:', error);
            throw error;
        }
    },
    delete: async (email) => {
        const sql = 'DELETE FROM users WHERE email = ?';
        await db.query(sql, [email]);
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