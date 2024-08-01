const db = require('../config/db');

const Key = {
    create: async (userId, encryptedKey) => {
        const sql = 'INSERT INTO `key` (uid, encryptedkey) VALUES (?, ?)';
        await db.query(sql, [userId, encryptedKey]);
    },

    findByUserId: async (userId) => {
        const [rows] = await db.query('SELECT * FROM `key` WHERE uid = ?', [userId]);
        return rows[0];
    }
};

module.exports = Key;