const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
};

exports.handler = async (event, context) => {
  try {
    await connectDB();

    const { email, password } = JSON.parse(event.body);

    const validEmail = email === process.env.USER_EMAIL;
    const validPassword = await bcrypt.compare(password, process.env.USER_PASSWORD);

    if (!validEmail || !validPassword) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: 'Invalid credentials' }),
      };
    }

    const token = jwt.sign({ id: 'single-user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};