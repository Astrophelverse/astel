const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    // Return user profile from request (set by auth middleware)
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    // Update user profile logic here
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Get user by ID (admin only)
router.get('/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    // Get user by ID logic here
    res.json({
      success: true,
      data: { id: userId, name: 'User Name' }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get user'
    });
  }
});

module.exports = router;
