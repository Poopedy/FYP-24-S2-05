const express = require('express');
const router = express.Router();
const plansController = require('../controller/plansController');

// Plan routes
router.post('/plans', plansController.createPlan);
router.post('/getplan', plansController.getPlanById);
router.get('/plans/name/:name', plansController.getPlanByName);
router.get('/plans', plansController.getAllPlans);
router.put('/plans/:planId', plansController.updatePlan);
router.delete('/plans/:planId', plansController.deletePlan);

module.exports = router;
