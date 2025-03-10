const express = require('express');
const Record = require('../models/Record');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

const router = express.Router();

// get all records
router.get('/getExerciseRecords', async (req, res) => {
	const { userId, exerciseName } = req.query;
	console.log(userId, exerciseName);
	const exerciseId = (await Exercise.findOne({ name: exerciseName }))._id;

	const curUser = await User.findById(userId).populate({
		path: 'records',
		select: 'reps weight createdAt',
		match: { forExercise: exerciseId },
		options: { sort: { createdAt: 1 } },
	});
	res.json(curUser.records);
});

// add record
router.post('/records', async (req, res) => {
	const { reps, weight, forExercise } = req.body;
	const newRecord = new Record({ reps, weight, forExercise });
	await newRecord.save();
	res.json(newRecord);
});

//delete record
router.delete('/records', async (req, res) => {
	const { id } = req.query;
	const deletedRecord = await Record.findByIdAndDelete(id);
	if (!deletedRecord) return res.json({ message: 'Record not found' });
	res.json({ message: 'Record deleted successfully' });
});

//update record
router.put('/records', async (req, res) => {
	const { id } = req.query;
	const { reps, weight, forExercise } = req.body;
	const updatedRecord = await Record.findByIdAndUpdate(
		id,
		{ reps, weight, forExercise },
		{ new: true }
	);
	if (!updatedRecord) return res.json({ message: 'Record not found' });
	res.json(updatedRecord);
});

module.exports = router;
