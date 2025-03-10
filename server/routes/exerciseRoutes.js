const express = require('express');
const fetch = require('node-fetch');
const Exercise = require('../models/Exercise');

const router = express.Router();

async function lookupExerciseInDatabase(name) {
  return await Exercise.find({
    $text: { $search: name },
  });
}

async function fetchExercisesFromAPI(name) {
  const apiUrl = `https://api.api-ninjas.com/v1/exercises?name=${name}`;
  const response = await fetch(apiUrl, {
    method: 'GET',
    headers: {
      'X-Api-Key': process.env.EXERCISE_API_KEY,
    },
  });

  return await response.json();
}

async function createExercisesInDatabase(exerciseDataArray) {
  const exercisesToSave = [];

  for (let exerciseData of exerciseDataArray) {
    const existingExercise = await Exercise.findOne({
      name: exerciseData.name,
    });

    if (!existingExercise) {
      const newExercise = new Exercise({
        name: exerciseData.name,
        type: exerciseData.type,
        muscle: exerciseData.muscle,
        equipment: exerciseData.equipment,
        difficulty: exerciseData.difficulty,
        instructions: exerciseData.instructions,
      });
      exercisesToSave.push(newExercise);
    }
  }

  if (exercisesToSave.length > 0) {
    return await Exercise.insertMany(exercisesToSave);
  }

  return [];
}

router.post('/getExercise', async (req, res) => {
  const { name } = req.body;

  const existingExercises = await lookupExerciseInDatabase(name);

  if (existingExercises.length > 0) {
    return res.json(existingExercises);
  }

  const exerciseData = await fetchExercisesFromAPI(name);

  if (exerciseData.length === 0) {
    return res.status(404).json({ message: 'No exercise found' });
  }

  const newExercises = await createExercisesInDatabase(exerciseData);

  res.json(newExercises);
});

router.post('/collectCloseMatches', async (req, res) => {
  const { name } = req.body;

  const exerciseData = await fetchExercisesFromAPI(name);

  if (exerciseData.length === 0) {
    return res.status(404).json({ message: 'No close matches found' });
  }

  const newExercises = [];

  for (let exercise of exerciseData) {
    const existingExercise = await Exercise.findOne({ name: exercise.name });
    if (!existingExercise) {
      newExercises.push(exercise);
    }
  }

  if (newExercises.length > 0) {
    const savedExercises = await createExercisesInDatabase(newExercises);
    return res.json(savedExercises);
  }

  res.status(400).json({ message: 'No new exercises to add' });
});

module.exports = router;
