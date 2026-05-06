const express = require('express');
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', registerUser);

// @desc    Login user
// @route   POST /api/auth/login
router.post('/login', loginUser);

// @desc    Request a password reset link
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// @desc    Reset password using the token from the email
// @route   PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', resetPassword);

module.exports = router;