// validations.js
const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for user login
const validateLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      error: errors.array()[0].msg, // Return the first error message
      message: 'Validation failed. Please check your input.',
    });
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
};