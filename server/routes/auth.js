const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // console.log('Received:', { email, password });
  // console.log('Expected:', { email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD });

  try {
    const validEmail = email === process.env.USER_EMAIL;
    // console.log('Email match:', validEmail);

    const validPassword = await bcrypt.compare(password, process.env.USER_PASSWORD);
    // console.log('Password match:', validPassword);

    if (!validEmail || !validPassword) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: 'single-user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.log('Error:', err.message); // Debug any errors
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;