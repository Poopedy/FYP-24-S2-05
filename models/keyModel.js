// models/keyModel.js
const db = require('../config/db');

const Key = {
    create: async (data) => {
        const sql = 'INSERT INTO CIPHERLINK.key (idKey, uid, datecreated, encryptedkey) VALUES (?, ?, ?, ?)';
        await db.query(sql, [data.keyid, data.uid, data.datecreated, data.encryptedkey]);
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
    update: async (keyid, data) => {
        const sql = 'UPDATE CIPHERLINK.key SET uid = ?, datecreated = ?, encryptedkey = ? WHERE idKey = ?';
        await db.query(sql, [data.uid, data.datecreated, data.encryptedkey, keyid]);
    },
    delete: async (keyid) => {
        const sql = 'DELETE FROM CIPHERLINK.key WHERE idKey = ?';
        await db.query(sql, [keyid]);
    }
};

module.exports = Key;
