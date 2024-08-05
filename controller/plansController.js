const Plan = require('../models/planModel');

const plansController = {
    createPlan: async (req, res) => {
        try {
            const { name, price } = req.body;
            const { uid } = req.session; // Get uid from session
            if (!uid) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            await Plan.create({ name, price, uid });
            res.status(201).json({ message: 'Plan created successfully.' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPlanById: async (req, res) => {
        try {
            const { planid } = req.body; // Retrieve planid from request body

            if (!planid) {
            return res.status(400).json({ message: 'Plan ID is required.' });
            }

            // Call model method to find the plan by planid
            const plan = await Plan.findById(planid);
            if (!plan) {
            return res.status(404).json({ message: 'Plan not found.' });
            }

            const { name, price } = plan;
            res.json({ name, price, status: 'Active' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getPlanByName: async (req, res) => {
        try {
            const { name } = req.params;
            const { uid } = req.session; // Get uid from session

            if (!uid) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const plan = await Plan.findByName(name, uid);
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
