const Task = require('../models/Task');
const Membership = require('../models/Membership');
const mongoose = require('mongoose');

const projectDashboard = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const total = await Task.countDocuments({ projectId });
    const byStatusAgg = await Task.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const tasksPerUserAgg = await Task.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(projectId), assignedTo: { $exists: true, $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
    ]);
    const overdue = await Task.find({ projectId, dueDate: { $lt: new Date() }, status: { $ne: 'Done' } }).populate('assignedTo', 'name email').lean();
    res.json({ total, byStatus: byStatusAgg, tasksPerUser: tasksPerUserAgg, overdue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const userDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Task.countDocuments({ assignedTo: userId });
    const byStatusAgg = await Task.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const overdue = await Task.find({ assignedTo: userId, dueDate: { $lt: new Date() }, status: { $ne: 'Done' } }).lean();
    res.json({ total, byStatus: byStatusAgg, overdue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { projectDashboard, userDashboard };
