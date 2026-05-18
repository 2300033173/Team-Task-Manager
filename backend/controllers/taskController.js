const Task = require('../models/Task');
const Membership = require('../models/Membership');

const createTask = async (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, dueDate, priority, assignedTo } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  try {
    const membership = await Membership.findOne({ projectId, userId: req.user._id });
    if (!membership || membership.role !== 'Admin') return res.status(403).json({ message: 'Admin required to create tasks' });
    const task = await Task.create({ projectId, title, description, dueDate: dueDate || null, priority: priority || 'Medium', assignedTo: assignedTo || null, createdBy: req.user._id });
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const listTasks = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email').lean();
    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  const { userId } = req.body;
  try {
    const membership = await Membership.findOne({ projectId, userId: req.user._id });
    if (!membership || membership.role !== 'Admin') return res.status(403).json({ message: 'Admin required' });
    const allowed = await Membership.findOne({ projectId, userId });
    if (!allowed) return res.status(400).json({ message: 'User is not a member of project' });
    const task = await Task.findByIdAndUpdate(taskId, { assignedTo: userId }, { new: true }).populate('assignedTo', 'name email');
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  const updates = req.body;
  try {
    const membership = await Membership.findOne({ projectId, userId: req.user._id });
    if (!membership) return res.status(403).json({ message: 'Not a project member' });
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    // Admin can update all fields
    if (membership.role === 'Admin') {
      Object.assign(task, updates);
      await task.save();
      return res.json({ task });
    }
    // Member: only allowed if assignedTo them and only limited fields (status, description)
    if (String(task.assignedTo) !== String(req.user._id)) return res.status(403).json({ message: 'Only assigned user can update this task' });
    const allowed = {};
    if (updates.status) allowed.status = updates.status;
    if (updates.description) allowed.description = updates.description;
    Object.assign(task, allowed);
    await task.save();
    res.json({ task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  try {
    const membership = await Membership.findOne({ projectId, userId: req.user._id });
    if (!membership || membership.role !== 'Admin') return res.status(403).json({ message: 'Admin required' });
    await Task.findByIdAndDelete(taskId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTask, listTasks, assignTask, updateTask, deleteTask };
