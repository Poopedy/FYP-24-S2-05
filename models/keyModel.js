// models/keyModel.js
const db = require('../config/db');

const Key = {
    create: async (userId, encryptedKey) => {
        const sql = 'INSERT INTO CIPHERLINK.key (uid, encryptedkey) VALUES (?, ?)';
        await db.query(sql, [userId, encryptedKey]);
    },
    findById: async (keyid) => {
        const [rows] = await db.query('SELECT encryptedkey FROM CIPHERLINK.key WHERE idKey = ?', [keyid]);
        return rows[0];
    },
    findByUserId: async (uid) => {
        const [rows] = await db.query('SELECT * FROM CIPHERLINK.key WHERE uid = ? ORDER BY datecreated DESC LIMIT 1', [uid]);
        return rows;
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM CIPHERLINK.key');
        return rows;
    },
    update: async (userId, key) => {
        const sql = 'UPDATE CIPHERLINK.key SET encryptedkey = ? WHERE uid = ?';
        await db.query(sql, [key, userId]);
    },
    delete: async (keyid) => {
        const sql = 'DELETE FROM CIPHERLINK.key WHERE idKey = ?';
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
