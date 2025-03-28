import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ExerciseItem from './ExerciseItem';
import { ContextLocalExercises } from './ContextLocalExercises';

export default function WorkoutSelect() {
  const [userWorkouts, setUserWorkouts] = useState([]);

  const { user, getAccessTokenSilently } = useAuth0();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState('');

  const { localExercises, setLocalExercises } = useContext(
    ContextLocalExercises
  );

  async function getUserWorkouts() {
    const token = await getAccessTokenSilently();
    const res = await axios.get('http://localhost:6060/api/getUsersWorkouts', {
      params: {
        userEmail: user.email,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
    return res.data;
  }

  async function addWorkout() {
    const token = await getAccessTokenSilently();

    await axios.post(
      'http://localhost:6060/api/createWorkout',
      {
        userEmail: user.email,
        workoutName: workoutName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getUserWorkouts().then((data) => {
      setUserWorkouts(data);
    });
    setWorkoutName('');
  }

  useEffect(() => {
    getUserWorkouts().then((data) => {
      setUserWorkouts(data);
    });
  }, [user]);

  useEffect(() => {
    if (selectedWorkout != '')
      setLocalExercises(
        userWorkouts.find((w) => w.name == selectedWorkout).exercises
      );
  }, [selectedWorkout]);

  return (
    <>
      <select
        name='Select Workout'
        id=''
        className='text-primary'
        value={selectedWorkout}
        onChange={(e) => {
          setSelectedWorkout(e.target.value);
        }}
      >
        <option value='' disabled selected>
          Select workout
        </option>
        {userWorkouts.map((w) => {
          return (
            <option key={w._id} value={w.name}>
              {w.name}
            </option>
          );
        })}
        {/* <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option> */}
      </select>
      <input
        placeholder='workout name'
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
      ></input>
      <button onClick={addWorkout}>add workout +</button>
      <div className='flex flex-wrap gap-6'>
        {localExercises.map((exercise) => {
          return (
            <ExerciseItem
              key={exercise._id}
              item={exercise}
              addOrDelete={'delete'}
            />
          );
        })}
      </div>
    </>
  );
}
