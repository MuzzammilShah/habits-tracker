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

exports.handler = async (event, context) => {
  try {
    await connectDB();
    auth(event);

    // Extract ID from path (e.g., /.netlify/functions/tasks-complete/123)
    const pathParts = event.path.split('/');
    const id = pathParts[pathParts.length - 1];
    
    const task = await Task.findById(id);
    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: 'Task not found' }),
      };
    }

    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const todayDate = new Date();
    const dayOfWeek = todayDate.getDay();

    const validDay = {
      'Everyday': true,
      'Mon-Fri': dayOfWeek >= 1 && dayOfWeek <= 5,
      'Sat-Sun': dayOfWeek === 0 || dayOfWeek === 6,
    }[task.daysToWorkOn];

    if (!validDay) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: 'Not a valid day to mark this task as done' }),
      };
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
    return {
      statusCode: 200,
      body: JSON.stringify(task),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: err.message === 'No token' || err.message === 'Invalid token' ? 401 : 500,
      body: JSON.stringify({ msg: 'Server error' }),
    };
  }
};