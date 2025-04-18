const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('./Task');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

const auth = (event) => {
  const token = event.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new Error('No token');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

const calculateStreak = (task) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const validDays = {
    'Everyday': [0, 1, 2, 3, 4, 5, 6],
    'Mon-Fri': [1, 2, 3, 4, 5],
    'Sat-Sun': [0, 6],
  }[task.daysToWorkOn];

  task.progress.sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastProgress = task.progress.filter(p => 
    new Date(p.date).toISOString().split('T')[0] <= todayStr
  );

  let streak = 0;
  for (let i = pastProgress.length - 1; i >= 0; i--) {
    const progressDate = new Date(pastProgress[i].date);
    if (validDays.includes(progressDate.getDay())) {
      if (pastProgress[i].completed) {
        streak++;
      } else {
        break;
      }
    }
  }
  return streak;
};

exports.handler = async (event, context) => {
  try {
    await connectDB();
    auth(event);

    const tasks = await Task.find().sort({ startDate: -1 });
    const tasksWithStreak = tasks.map(task => {
      task.streak = calculateStreak(task);
      return task;
    });

    return {
      statusCode: 200,
      body: JSON.stringify(tasksWithStreak),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};