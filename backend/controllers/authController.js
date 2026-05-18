const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  return { accessToken, refreshToken };
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: email.toLowerCase(), password: hash });
    const { accessToken, refreshToken } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken });
    res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields required' });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    if (user.lockUntil && user.lockUntil > new Date()) {
      return res.status(429).json({ message: 'Account locked. Try again later.' });
    }
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      await User.findByIdAndUpdate(user._id, {
        loginAttempts: user.loginAttempts + 1,
        lockUntil: user.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS ? new Date(Date.now() + LOCK_TIME) : null
      });
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const { accessToken, refreshToken } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken, loginAttempts: 0, lockUntil: null });
    res.json({ accessToken, refreshToken, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required' });
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(200).json({ message: 'If email exists, reset link sent' });
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await User.findByIdAndUpdate(user._id, { resetToken, resetTokenExpiry });
    
    // In production, send email with reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);
    res.json({ message: 'If email exists, reset link sent', resetToken }); // Remove resetToken in production
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ message: 'Token and password required' });
  if (newPassword.length < 6) return res.status(400).json({ message: 'Password too short' });
  try {
    const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
    
    const hash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hash, resetToken: null, resetTokenExpiry: null });
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, login, refreshAccessToken, requestPasswordReset, resetPassword };
