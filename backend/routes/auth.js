const express = require('express');
const router = express.Router();
const { signup, login, refreshAccessToken, requestPasswordReset, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
