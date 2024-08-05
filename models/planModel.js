const db = require('../config/db');

const Plan = {
    create: async (data) => {
        const sql = 'INSERT INTO plans (name, price, uid) VALUES (?, ?, ?)';
        await db.query(sql, [data.name, data.price, data.uid]);
    },
    findById: async (planId) => {
        console.log('4',planId)
        const [rows] = await db.query('SELECT * FROM plans WHERE planid = ?', [planId]);
        return rows[0];
    },
    findByName: async (name, uid) => {
        const [rows] = await db.query('SELECT * FROM plans WHERE name = ? AND uid = ?', [name, uid]);
        return rows[0];
    },
    getAll: async (uid) => {
        const [rows] = await db.query('SELECT * FROM plans WHERE uid = ?', [uid]);
        return rows;
    },
    update: async (planId, data) => {
        const sql = 'UPDATE plans SET name = ?, price = ? WHERE planid = ? AND uid = ?';
        await db.query(sql, [data.name, data.price, planId, data.uid]);
    },
    delete: async (planId, uid) => {
        const sql = 'DELETE FROM plans WHERE planid = ? AND uid = ?';
        await db.query(sql, [planId, uid]);
    }
};

module.exports = Plan;
