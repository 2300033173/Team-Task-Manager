const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const dashboardCtrl = require('../controllers/dashboardController');

router.get('/project/:projectId', auth, dashboardCtrl.projectDashboard);
router.get('/user', auth, dashboardCtrl.userDashboard);

module.exports = router;
