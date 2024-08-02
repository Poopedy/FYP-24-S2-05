const db = require('../config/db');

const Plan = {
    create: async (data) => {
        const sql = 'INSERT INTO plans (name, price) VALUES (?, ?)';
        await db.query(sql, [data.name, data.price]);
    },
    findById: async (planId) => {
        const [rows] = await db.query('SELECT * FROM plans WHERE planid = ?', [planId]);
        return rows[0];
    },
    findByName: async (name) => {
        const [rows] = await db.query('SELECT * FROM plans WHERE name = ?', [name]);
        return rows[0];
    },
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM plans');
        return rows;
    },
    update: async (planId, data) => {
        const sql = 'UPDATE plans SET name = ?, price = ? WHERE planid = ?';
        await db.query(sql, [data.name, data.price, planId]);
    },
    delete: async (planId) => {
        const sql = 'DELETE FROM plans WHERE planid = ?';
        await db.query(sql, [planId]);
    }
};

module.exports = Plan;
