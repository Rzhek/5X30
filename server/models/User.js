const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, unique: true },
	password: { type: String, required: true },
	workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
	records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record' }],
});

module.exports = mongoose.model('User', userSchema);
