// userValidations.js
const { body, param, validationResult } = require('express-validator');

// Validation rules for getting a user by ID
const validateUserId = [
  param('id').isInt().withMessage('User ID must be an integer'),
];

// Validation rules for updating a user
const validateUpdateUser = [
  param('id').isInt().withMessage('User ID must be an integer'),
  body('firstName').optional().notEmpty().withMessage('First name is required'),
  body('lastName').optional().notEmpty().withMessage('Last name is required'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
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
  validateUserId,
  validateUpdateUser,
  handleValidationErrors,
};