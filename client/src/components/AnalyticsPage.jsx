import { useState, useEffect } from 'react';
import RepsAndWeightGraph from './RepsAndWeightGraph';
import { useAuth0 } from '@auth0/auth0-react';
import getUserWorkouts from '../util/getUserWorkouts';
import WorkoutFullCard from './WorkoutFullCard';
import { callGet } from '../util/external-api.service';
import MuscleGraph from './MuscleGraph';
import ExerciseGraph from './ExerciseGraph';

const GRAPH_TABS = [
  { label: 'Reps & Weight', component: RepsAndWeightGraph },
  { label: 'Muscles', component: MuscleGraph },
  { label: 'Exercises', component: ExerciseGraph },
];

export default function AnalyticsPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const [userWorkouts, setUserWorkouts] = useState([]);
  const [userRecords, setUserRecords] = useState([]);
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = await getAccessTokenSilently();
      const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
      setUserWorkouts(await getUserWorkouts(token, user));
      const records = await callGet({
        url: `${apiServerUrl}/api/getUsersRecords`,
        params: { userEmail: user.email },
        token: token,
      });
      setUserRecords(records.data);
    };

    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  console.log(userRecords);

  const ActiveGraphComponent = GRAPH_TABS[activeTab].component;

  return (
    <div className='m-8'>
      <h1 className='text-2xl text-primary font-bold mb-4'>Analytics Page</h1>

      {activeTab == 0
        ? userWorkouts.map((w) => (
            <WorkoutFullCard
              key={w._id}
              workout={w}
              uniqueExercises={uniqueExercises}
              setUniqueExercises={setUniqueExercises}
            />
          ))
        : ''}

      {userRecords.length > 0 && (
        <div className='mt-8'>
          <div className='flex space-x-4 border-b pb-2 mb-4'>
            {GRAPH_TABS.map((tab, index) => (
              <button
                key={index}
                className={`pb-2 font-semibold ${
                  activeTab === index
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-500 hover:text-primary'
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <ActiveGraphComponent
            data={userRecords}
            uniqueExercises={uniqueExercises}
          />
        </div>
      )}
    </div>
  );
}
