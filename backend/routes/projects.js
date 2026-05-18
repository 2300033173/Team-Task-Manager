const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/projectAdmin');
const projectCtrl = require('../controllers/projectController');
const taskCtrl = require('../controllers/taskController');

// Project routes
router.post('/', auth, projectCtrl.createProject);
router.get('/', auth, projectCtrl.getUserProjects);
router.get('/:projectId', auth, projectCtrl.getProjectDetail);

// Members
router.post('/:projectId/members', auth, admin, projectCtrl.addMember);
router.delete('/:projectId/members/:userId', auth, admin, projectCtrl.removeMember);

// Tasks (nested)
router.get('/:projectId/tasks', auth, taskCtrl.listTasks);
router.post('/:projectId/tasks', auth, taskCtrl.createTask);
router.put('/:projectId/tasks/:taskId', auth, taskCtrl.updateTask);
router.post('/:projectId/tasks/:taskId/assign', auth, taskCtrl.assignTask);
router.delete('/:projectId/tasks/:taskId', auth, taskCtrl.deleteTask);

module.exports = router;
