const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} = require('../middleware/authvalidations'); // Import validation middleware
const router = express.Router();

// Register route with validation
router.post('/register', validateRegistration, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    res.status(201).json({
      code: 201,
      error: null,
      message: 'User registered successfully.',
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
      message: 'User registration failed due to invalid input or server error.',
    });
  }
});

// Login route with validation
router.post('/login', validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        code: 404,
        error: 'User not found',
        message: 'No user exists with the provided email address.',
      });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        code: 401,
        error: 'Invalid password',
        message: 'The provided password does not match the user\'s password.',
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
      message: 'Login failed due to an unexpected error.',
    });
  }
});

module.exports = router;