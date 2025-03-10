const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	muscle: { type: String, required: true },
	equipment: { type: String, required: true },
	difficulty: { type: String, required: true },
	instructions: { type: String, required: true },
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
