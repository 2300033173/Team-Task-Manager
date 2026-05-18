const Membership = require('../models/Membership');

module.exports = async function (req, res, next) {
  const projectId = req.params.projectId || req.params.id || req.body.projectId;
  if (!projectId) return res.status(400).json({ message: 'Project id required' });
  const membership = await Membership.findOne({ projectId, userId: req.user._id });
  if (!membership || membership.role !== 'Admin') return res.status(403).json({ message: 'Admin role required' });
  next();
};
