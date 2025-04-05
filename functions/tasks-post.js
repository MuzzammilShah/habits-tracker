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

    const { name, endDate, daysToWorkOn, about } = JSON.parse(event.body);
    const task = new Task({
      name,
      endDate,
      daysToWorkOn,
      about,
    });
    await task.save();
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