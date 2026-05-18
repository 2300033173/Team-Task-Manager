const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' }
  },
  { timestamps: true }
);

membershipSchema.index({ projectId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Membership', membershipSchema);
