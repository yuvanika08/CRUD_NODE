const express = require('express');
const { User } = require('../models');
const authenticate = require('../middleware/authenticate');
const {
  validateUserId,
  validateUpdateUser,
  handleValidationErrors,
} = require('../middleware/userValidations'); // Import validation middleware
const router = express.Router();

// Get all users
router.get('/', authenticate, handleValidationErrors, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      code: 200,
      error: null,
      message: 'Users retrieved successfully.',
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
      message: 'Failed to retrieve users.',
    });
  }
});

// Get a user by ID
router.get('/:id', authenticate, validateUserId, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        error: 'User not found',
        message: 'No user exists with the provided ID.',
      });
    }
    res.json({
      code: 200,
      error: null,
      message: 'User retrieved successfully.',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
      message: 'Failed to retrieve the user.',
    });
  }
});

// Update a user
router.put('/:id', authenticate, validateUpdateUser, handleValidationErrors, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        error: 'User not found',
        message: 'No user exists with the provided ID.',
      });
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    await user.save();
    res.json({
      code: 200,
      error: null,
      message: 'User updated successfully.',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
      message: 'Failed to update the user.',
    });
  }
});

// Delete a user
router.delete('/:id', authenticate, validateUserId, handleValidationErrors, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        code: 404,
        error: 'User not found',
        message: 'No user exists with the provided ID.',
      });
    }
    await user.destroy();
    res.status(204).json({
      code: 204,
      error: null,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    res.status(400).json({
      code: 400,
      error: error.message,
      message: 'Failed to delete the user.',
    });
  }
});

module.exports = router;