const express = require('express');
const Workout = require('../models/Workout');
const User = require('../models/User');

const router = express.Router();

router.get('/findWorkoutById', async (req, res) => {
	const id = req?.query?.id;
	if (!id) return res.status(400).json({ message: 'No id provided' });

	const workout = await Workout.findById(id).populate('exercises');
	if (!workout) {
		return res.status(404).json({ message: 'Workout not found' });
	}
	res.json(workout);
});

router.get('/getUsersWorkouts', async (req, res) => {
	try {
		const { userEmail } = req.query;
		const user = await User.findOne({ email: userEmail }).populate({
			path: 'workouts',
			populate: {
				path: 'exercises',
			},
		});

		if (!user) return res.status(404).json({ error: 'User not found' });

		if (!user.workouts) return res.json([]);
		return res.json(user.workouts);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

router.post('/createWorkout', async (req, res) => {
	try {
		const { userEmail, workoutName, exercises } = req.body;
		if (!userEmail) {
			throw new Error('User ID missing');
		}
		if (!workoutName) {
			throw new Error('Workout Name missing');
		}

		const curUser = await User.findOne({ email: userEmail });
		if (!curUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		const newWorkout = new Workout({ name: workoutName, exercises });
		await newWorkout.save();
		curUser.workouts.push(newWorkout);
		curUser.save();
		res.status(201).json({ message: 'Workout Added Successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

router.delete('/deleteWorkout', async (req, res) => {
	try {
		const { userEmail, workoutId } = req.body;
		if (!userEmail) {
			throw new Error('User ID missing');
		}
		if (!workoutId) {
			throw new Error('Workout ID missing');
		}

		const curUser = await User.findOne({ email: userEmail });
		if (!curUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		await Workout.findByIdAndDelete(workoutId);

		// curUser.workouts = curUser.workouts.filter((obj) => {
		// 	obj.toString() !== workoutId;
		// });
		// await curUser.workouts.findByIdAndDelete(workoutId);
		await User.updateOne(
			{ email: userEmail },
			{ $pull: { workouts: workoutId } }
		);

		await curUser.save();
		res.json({ message: 'Workout deleted successfully' });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

router.put('/updateWorkout', async (req, res) => {
	try {
		const { workoutId, newName, exercises } = req.body;

		if (!workoutId) {
			return res.status(400).json({ error: 'Workout ID missing' });
		}
		if (!newName) {
			return res.status(400).json({ error: 'New name missing' });
		}
		if (!exercises || exercises.length == 0) {
			return res.status(400).json({ error: 'Exercises missing' });
		}

		const workout = await Workout.findById(workoutId);

		if (!workout) {
			return res.status(404).json({ error: 'Workout not found' });
		}

		workout.name = newName;
		workout.exercises = exercises;
		await workout.save();

		res.json({ data: await workout.populate('exercises') });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
