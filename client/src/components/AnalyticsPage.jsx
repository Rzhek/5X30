import { useState, useEffect } from 'react';
import Chart from './Chart';
import { useAuth0 } from '@auth0/auth0-react';
import getUserWorkouts from '../util/getUserWorkouts';
import WorkoutFullCard from './WorkoutFullCard';
import { callGet } from '../util/external-api.service';

export default function AnalyticsPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [userRecords, setUserRecords] = useState([]);
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [selectedType, setSelectedType] = useState('weight');

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = await getAccessTokenSilently();
      const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
      setUserWorkouts(await getUserWorkouts(token, user));
      const records = await callGet({
        url: `${apiServerUrl}/api/getUsersRecords`,
        params: {
          userEmail: user.email,
        },
        token: token,
      });
      setUserRecords(records.data);
    };
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  return (
    <div className='m-8'>
      <h1 className='text-2xl text-primary font-bold'>Analytics Page</h1>

      {userWorkouts.map((w) => (
        <WorkoutFullCard
          workout={w}
          uniqueExercises={uniqueExercises}
          setUniqueExercises={setUniqueExercises}
        />
      ))}

      {userRecords.length ? (
        <>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className='text-gray-200'
          >
            <option value='weight'>Weight</option>
            <option value='reps'>Reps</option>
            <option value='both'>Both</option>
          </select>
          <Chart
            data={userRecords}
            uniqueExercises={uniqueExercises}
            selectedType={selectedType}
          />
        </>
      ) : (
        ''
      )}
    </div>
  );
}
