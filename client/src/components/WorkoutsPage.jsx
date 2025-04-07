import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import getUserWorkouts from '../util/getUserWorkouts';
import RecordInput from './RecordInput';

export default function WorkoutsPage() {
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [userWorkouts, setUserWorkouts] = useState([]);
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = await getAccessTokenSilently();
      setUserWorkouts(await getUserWorkouts(token, user));
    };
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  return (
    <div className='p-6 md:p-8 bg-secondary rounded-lg shadow-md m-6'>
      <h1 className='text-2xl md:text-3xl font-bold text-primary mb-6 pb-2 border-b border-secondary border-opacity-50'>
        Log Your Workout
      </h1>

      <div className='mb-8'>
        <label
          htmlFor='select-log-workout'
          className='block text-sm font-medium text-gray-400 mb-1'
        >
          Choose a workout to log:
        </label>
        <select
          name='Select Workout'
          id='select-log-workout'
          className='w-full max-w-md px-4 py-2 border border-secondary rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white text-gray-700'
          value={selectedWorkout}
          onChange={(e) => {
            setSelectedWorkout(e.target.value);
          }}
        >
          <option value='' disabled>
            Select workout...
          </option>
          {userWorkouts.map((w) => (
            <option key={w._id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {selectedWorkout !== '' && (
        <div className='mt-6 space-y-4'>
          <h2 className='text-xl font-semibold text-primary'>
            Record Exercises for '{selectedWorkout}'
          </h2>
          <div className='space-y-4 md:space-y-5'>
            {userWorkouts
              .find((w) => w.name === selectedWorkout)
              ?.exercises.map((e) => (
                <RecordInput key={e._id} name={e.name} id={e._id} />
              ))}
          </div>
        </div>
      )}

      {selectedWorkout === '' && (
        <p className='text-secondary italic mt-6'>
          Please select a workout from the list above to start logging.
        </p>
      )}
    </div>
  );
}
