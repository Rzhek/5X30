const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
  records: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Record' }],
});

module.exports = mongoose.model('User', userSchema);
