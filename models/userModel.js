const db = require('../config/db');

const User = {
    create: async (data) => {
        const sql = 'INSERT INTO users (email, username, password, role, planid) VALUES (?, ?, ?, ?, ?)';
        await db.query(sql, [data.email, data.username, data.password, data.role, data.planid]);
    },
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    }
};

module.exports = User;