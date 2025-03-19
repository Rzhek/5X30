const express = require('express');
const User = require('../models/User');
const { validateAccessToken } = require('../middleware/auth0.middleware');

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    console.log(res.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  const users = await User.find().populate('workouts');
  res.json(users);
});

router.get('/noauth', async (req, res) => {
  res.json('no auth');
});

router.get('/yesauth', validateAccessToken, async (req, res) => {
  res.json('yes auth');
});

module.exports = router;
