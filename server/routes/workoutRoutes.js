const express = require('express');
const Workout = require('../models/Workout');

const router = express.Router();

router.post('/workouts', async (req, res) => {
	try {
		const newWorkout = new Workout(req.body);
		console.log(res.body);
		await newWorkout.save();
		res.status(201).json(newWorkout);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.get('/workouts', async (req, res) => {
	const workouts = await Workout.find();
	res.json(workouts);
});

router.get('/findWorkoutById', async (req, res) => {
	const id = req?.query?.id;
	if (!id) return res.status(404).json({ message: 'No id provided' });

	const workout = await Workout.findById(id);
	if (!workout) {
		return res.status(404).json({ message: 'Workout not found' });
	}
	res.json(workout);
});

module.exports = router;
