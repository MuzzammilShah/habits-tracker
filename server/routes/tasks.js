const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const router = express.Router();

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// GET all tasks
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ startDate: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST a new task
router.post('/', auth, async (req, res) => {
  const { name, endDate, daysToWorkOn, about } = req.body;
  try {
    const task = new Task({
      name,
      endDate,
      daysToWorkOn,
      about,
    });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST to mark a task as complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay(); // 0 (Sun) to 6 (Sat)

    // Check if today matches the task's daysToWorkOn
    const validDay = {
      'Everyday': true,
      'Mon-Fri': dayOfWeek >= 1 && dayOfWeek <= 5,
      'Sat-Sun': dayOfWeek === 0 || dayOfWeek === 6,
    }[task.daysToWorkOn];

    if (!validDay) {
      return res.status(400).json({ msg: 'Not a valid day to mark this task as done' });
    }

    const existingToday = task.progress.find(p => new Date(p.date).toLocaleDateString('en-CA') === today);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const existingYesterday = task.progress.find(p => new Date(p.date).toLocaleDateString('en-CA') === yesterday);

    if (!existingToday) {
      task.progress.push({ date: new Date(), completed: true });

      if (existingYesterday && existingYesterday.completed) {
        task.streak = (task.streak || 0) + 1;
      } else if (!existingYesterday) {
        const startDate = new Date(task.startDate).toLocaleDateString('en-CA');
        if (startDate === today) {
          task.streak = 1;
        } else {
          task.streak = 1;
        }
      } else {
        task.streak = 1;
      }

      await task.save();
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;