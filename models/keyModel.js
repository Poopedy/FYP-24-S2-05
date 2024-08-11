// models/keyModel.js
const db = require('../config/db');

const Key = {
    create: async (userId, encryptedKey) => {
        const sql = 'INSERT INTO `keys` (uid, encryptedkey) VALUES (?, ?)';
        await db.query(sql, [userId, encryptedKey]);
    },
    findById: async (keyid) => {
        const [rows] = await db.query('SELECT * FROM `keys` WHERE keyid = ?', [keyid]);
        return rows[0];
    },
    findByUserId: async (uid) => {
        const [rows] = await db.query('SELECT * FROM `keys` WHERE uid = ?', [uid]);
        return rows;
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM `keys`');
        return rows;
    },
    update: async (userId, key) => {
        const sql = 'UPDATE `keys` SET encryptedkey = ? WHERE uid = ?';
        await db.query(sql, [key, userId]);
    },
    delete: async (keyid) => {
        const sql = 'DELETE FROM `keys` WHERE keyid = ?';
        await db.query(sql, [keyid]);
    }
};

module.exports = Key;
// const db = require('../config/db');

// const Key = {
//     create: async (userId, encryptedKey) => {
//         const sql = 'INSERT INTO `key` (uid, encryptedkey) VALUES (?, ?)';
//         await db.query(sql, [userId, encryptedKey]);
//     },

//     findByUserId: async (userId) => {
//         const [rows] = await db.query('SELECT * FROM `key` WHERE uid = ?', [userId]);
//         return rows[0];
//     }
// };

// module.exports = Key;
