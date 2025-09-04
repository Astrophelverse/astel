const express = require('express');
const router = express.Router();

// Get stories
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { stories: [] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get stories'
    });
  }
});

module.exports = router;
