const Plan = require('../models/planModel');

const plansController = {
    createPlan: async (req, res) => {
        try {
            const { name, price } = req.body;
            await Plan.create({ name, price });
            res.status(201).json({ message: 'Plan created successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPlanById: async (req, res) => {
        try {
            const { planId } = req.params;
            const plan = await Plan.findById(planId);
            if (!plan) {
                return res.status(404).json({ message: 'Plan not found.' });
            }
            res.json(plan);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPlanByName: async (req, res) => {
        try {
            const { name } = req.params;
            const plan = await Plan.findByName(name);
            if (!plan) {
                return res.status(404).json({ message: 'Plan not found.' });
            }
            res.json(plan);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getAllPlans: async (req, res) => {
        try {
            const plans = await Plan.getAll();
            res.json(plans);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updatePlan: async (req, res) => {
        try {
            const { planId } = req.params;
            const { name, price } = req.body;
            await Plan.update(planId, { name, price });
            res.json({ message: 'Plan updated successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deletePlan: async (req, res) => {
        try {
            const { planId } = req.params;
            await Plan.delete(planId);
            res.json({ message: 'Plan deleted successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = plansController;
