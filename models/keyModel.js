// models/keyModel.js
const db = require('../config/db');

const Key = {
    create: async (data) => {
        const sql = 'INSERT INTO keys (keyid, uid, datecreated, encryptedkey) VALUES (?, ?, ?, ?)';
        await db.query(sql, [data.keyid, data.uid, data.datecreated, data.encryptedkey]);
    },
    findById: async (keyid) => {
        const [rows] = await db.query('SELECT * FROM keys WHERE keyid = ?', [keyid]);
        return rows[0];
    },
    findByUserId: async (uid) => {
        const [rows] = await db.query('SELECT * FROM keys WHERE uid = ?', [uid]);
        return rows;
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM keys');
        return rows;
    },
    update: async (keyid, data) => {
        const sql = 'UPDATE keys SET uid = ?, datecreated = ?, encryptedkey = ? WHERE keyid = ?';
        await db.query(sql, [data.uid, data.datecreated, data.encryptedkey, keyid]);
    },
    delete: async (keyid) => {
        const sql = 'DELETE FROM keys WHERE keyid = ?';
        await db.query(sql, [keyid]);
    }
};

module.exports = Key;
