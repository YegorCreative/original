const express = require('express');
const { verifyToken } = require('../middleware/auth');
const pool = require('../db');
const { calculateStreak } = require('../utils/streak');

const router = express.Router();

// Create a habit
router.post('/', verifyToken, async (req, res) => {
  const { name, description, category } = req.body;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'INSERT INTO habits (user_id, name, description, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, description, category || 'other']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's habits with streaks
router.get('/', verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const result = await pool.query(
      `SELECT h.*, 
        (SELECT COUNT(*) FROM habit_logs WHERE habit_id = h.id AND completed = true) as total_completed
       FROM habits h 
       WHERE h.user_id = $1
       ORDER BY h.created_at DESC`,
      [userId]
    );

    // Fetch completed log dates for each habit and compute streaks
    const habits = await Promise.all(result.rows.map(async (habit) => {
      const logsRes = await pool.query(
        `SELECT log_date FROM habit_logs WHERE habit_id = $1 AND completed = true ORDER BY log_date DESC`,
        [habit.id]
      );
      const logDates = logsRes.rows.map(r => r.log_date instanceof Date
        ? r.log_date.toISOString().split('T')[0]
        : String(r.log_date).split('T')[0]);
      const streak = calculateStreak(logDates);

      // Check if today is already logged
      const todayStr = new Date().toISOString().split('T')[0];
      const todayLog = await pool.query(
        `SELECT completed FROM habit_logs WHERE habit_id = $1 AND log_date = $2`,
        [habit.id, todayStr]
      );
      const completedToday = todayLog.rows.length > 0 && todayLog.rows[0].completed;

      return { ...habit, ...streak, completedToday };
    }));

    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get habit details with streak
router.get('/:habitId', verifyToken, async (req, res) => {
  const { habitId } = req.params;
  const userId = req.userId;

  try {
    const habitResult = await pool.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, userId]
    );

    if (habitResult.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const logsResult = await pool.query(
      `SELECT * FROM habit_logs 
       WHERE habit_id = $1 
       ORDER BY log_date DESC`,
      [habitId]
    );

    res.json({
      habit: habitResult.rows[0],
      logs: logsResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Log a habit completion
router.post('/:habitId/log', verifyToken, async (req, res) => {
  const { habitId } = req.params;
  const { date } = req.body;
  const userId = req.userId;

  try {
    // Verify habit belongs to user
    const habitCheck = await pool.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, userId]
    );

    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const logDate = date || new Date().toISOString().split('T')[0];

    // Check if log exists for this date
    const existingLog = await pool.query(
      'SELECT * FROM habit_logs WHERE habit_id = $1 AND log_date = $2',
      [habitId, logDate]
    );

    if (existingLog.rows.length > 0) {
      // Toggle completion
      const result = await pool.query(
        'UPDATE habit_logs SET completed = NOT completed WHERE habit_id = $1 AND log_date = $2 RETURNING *',
        [habitId, logDate]
      );
      return res.json(result.rows[0]);
    }

    // Create new log
    const result = await pool.query(
      `INSERT INTO habit_logs (habit_id, log_date, completed) 
       VALUES ($1, $2, true) RETURNING *`,
      [habitId, logDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a habit
router.delete('/:habitId', verifyToken, async (req, res) => {
  const { habitId } = req.params;
  const userId = req.userId;

  try {
    const result = await pool.query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING *',
      [habitId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
