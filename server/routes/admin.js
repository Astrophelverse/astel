const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');

// Apply admin middleware to all routes
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalUsers: 0,
        totalPosts: 0,
        totalStories: 0,
        totalAds: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard stats'
    });
  }
});

module.exports = router;
