const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Create a new user
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

// Get all users
router.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

module.exports = router;
