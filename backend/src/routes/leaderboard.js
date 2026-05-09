const express = require('express');
const { verifyToken } = require('../middleware/auth');
const pool = require('../db');

const router = express.Router();

// Community leaderboard: top users by total habit completions this week
router.get('/', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        COUNT(hl.id) AS completions_this_week,
        COUNT(DISTINCT h.id) AS habit_count
      FROM users u
      JOIN habits h ON h.user_id = u.id
      JOIN habit_logs hl ON hl.habit_id = h.id
      WHERE hl.completed = true
        AND hl.log_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY u.id, u.name
      ORDER BY completions_this_week DESC
      LIMIT 20
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
