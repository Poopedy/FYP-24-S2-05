// models/fileModel.js
const db = require('../config/db');

const File = {
    create: async (data) => {
        const sql = 'INSERT INTO files (filed, keyid, filename, filelocation, filesize, uid, uploaddate) VALUES (?, ?, ?, ?, ?, ?, ?)';
        await db.query(sql, [data.filed, data.keyid, data.filename, data.filelocation, data.filesize, data.uid, data.uploaddate]);
    },
    findById: async (fileId) => {
        const [rows] = await db.query('SELECT * FROM files WHERE filed = ?', [fileId]);
        return rows[0];
    },
    findByKey: async (keyid) => {
        const [rows] = await db.query('SELECT * FROM files WHERE keyid = ?', [keyid]);
        return rows[0];
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM files');
        return rows;
    },
    update: async (fileId, data) => {
        const sql = 'UPDATE files SET keyid = ?, filename = ?, filelocation = ?, filesize = ?, uid = ?, uploaddate = ? WHERE filed = ?';
        await db.query(sql, [data.keyid, data.filename, data.filelocation, data.filesize, data.uid, data.uploaddate, fileId]);
    },
    checkUserFiles: async (userId) => {
        const sql = 'SELECT EXISTS(SELECT 1 FROM files WHERE uid = ?) AS fileExists';
        const [rows] = await db.query(sql, [userId]);
        return rows[0].fileExists === 1; // If fileExists is 1, files exist
    },
    delete: async (fileId) => {
        const sql = 'DELETE FROM files WHERE filed = ?';
        await db.query(sql, [fileId]);
    }
};

module.exports = File;
