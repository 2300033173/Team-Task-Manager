const Project = require('../models/Project');
const Membership = require('../models/Membership');
const User = require('../models/User');
const Task = require('../models/Task');

const createProject = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: 'Project name required' });
  try {
    const project = await Project.create({ name, description, createdBy: req.user._id });
    await Membership.create({ projectId: project._id, userId: req.user._id, role: 'Admin' });
    res.json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProjects = async (req, res) => {
  try {
    const memberships = await Membership.find({ userId: req.user._id }).populate('projectId');
    const projects = memberships.map(m => ({ project: m.projectId, role: m.role }));
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectDetail = async (req, res) => {
  const projectId = req.params.projectId;
  try {
    const project = await Project.findById(projectId).lean();
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const memberships = await Membership.find({ projectId }).populate('userId', 'name email');
    const members = memberships.map(m => ({ id: m.userId._id, name: m.userId.name, email: m.userId.email, role: m.role }));
    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email').lean();
    res.json({ project, members, tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addMember = async (req, res) => {
  const projectId = req.params.projectId;
  const { email, role } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const existing = await Membership.findOne({ projectId, userId: user._id });
    if (existing) return res.status(400).json({ message: 'User already a member' });
    const membership = await Membership.create({ projectId, userId: user._id, role: role === 'Admin' ? 'Admin' : 'Member' });
    res.json({ membership });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeMember = async (req, res) => {
  const projectId = req.params.projectId;
  const userId = req.params.userId;
  try {
    await Membership.findOneAndDelete({ projectId, userId });
    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProject, getUserProjects, getProjectDetail, addMember, removeMember };
