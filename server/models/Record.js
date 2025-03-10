const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	reps: { type: Number, required: true },
	weight: { type: Number, required: true },
	// { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
