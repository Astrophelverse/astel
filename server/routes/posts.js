const express = require('express');
const router = express.Router();

// Get posts feed
router.get('/feed', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { posts: [], hasMore: false }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get posts'
    });
  }
});

module.exports = router;
