const express = require('express');
const { verifyToken } = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      'SELECT id, email, name, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user stats
router.get('/stats', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const habitCount = await pool.query(
      'SELECT COUNT(*) FROM habits WHERE user_id = $1',
      [userId]
    );

    const totalCompleted = await pool.query(
      `SELECT COUNT(*) FROM habit_logs hl
       JOIN habits h ON hl.habit_id = h.id
       WHERE h.user_id = $1 AND hl.completed = true`,
      [userId]
    );

    res.json({
      totalHabits: habitCount.rows[0].count,
      totalCompleted: totalCompleted.rows[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
