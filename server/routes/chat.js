const express = require('express');
const router = express.Router();

// Get conversations
router.get('/conversations', async (req, res) => {
  try {
    res.json({
      success: true,
      data: { conversations: [] }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get conversations'
    });
  }
});

module.exports = router;
