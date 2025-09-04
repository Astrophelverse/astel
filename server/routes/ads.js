const express = require('express');
const router = express.Router();

// Get ads
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { ads: [] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get ads'
    });
  }
});

module.exports = router;
