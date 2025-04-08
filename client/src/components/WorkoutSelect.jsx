import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ExerciseItem from './ExerciseItem';
import { ContextLocalExercises } from './ContextLocalExercises';
import { callGet } from '../util/external-api.service';
import { toast } from 'react-toastify';

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
		const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;

		const res = await callGet({
			url: `${apiServerUrl}/api/getUsersWorkouts`,
			params: { userEmail: user.email },
			token: token,
		});
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
		toast.success('Workout added');
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

	async function pushLocalWorkoutChanges() {
		const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
		const token = await getAccessTokenSilently();
		await axios.put(
			`${apiServerUrl}/api/updateWorkout`,
			{
				workoutId: userWorkouts.find((w) => w.name == selectedWorkout)._id,
				newName: selectedWorkout,
				exercises: localExercises.map((e) => e._id),
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		);

		const temp = selectedWorkout;
		getUserWorkouts().then((data) => {
			setUserWorkouts(data);
			setSelectedWorkout(temp);
			toast.success('Workout saved');
		});
	}

	const deleteWorkout = async () => {
		const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
		const token = await getAccessTokenSilently();

		await axios.delete(`${apiServerUrl}/api/deleteWorkout`, {
			data: {
				userEmail: user.email,
				workoutId: userWorkouts.find((w) => w.name == selectedWorkout)._id,
			},
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});
		getUserWorkouts().then((data) => {
			setUserWorkouts(data);
		});
		setSelectedWorkout('');
		setLocalExercises([]);
		toast.info('Workout deleted');
	};

	return (
		<div className='p-6 space-y-6 bg-secondary rounded-lg shadow-md mb-4'>
			<div className='space-y-4'>
				<h2 className='text-xl font-semibold text-primary'>Manage Workouts</h2>
				<div className='flex flex-wrap items-center gap-4'>
					<div className='flex-grow min-w-[200px]'>
						<label htmlFor='select-workout' className='sr-only'>
							Select Workout
						</label>
						<select
							name='Select Workout'
							id='select-workout'
							className='w-full px-4 py-2 border border-secondary rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white text-gray-700'
							value={selectedWorkout}
							onChange={(e) => {
								setSelectedWorkout(e.target.value);
							}}
						>
							<option value='' disabled>
								Select existing workout...
							</option>
							{userWorkouts.map((w) => (
								<option key={w._id} value={w.name}>
									{w.name}
								</option>
							))}
						</select>
					</div>

					{selectedWorkout !== '' && (
						<button
							onClick={deleteWorkout}
							className='px-4 py-2 bg-accent text-white rounded-md font-semibold shadow-sm hover:bg-opacity-80 transition duration-150 ease-in-out whitespace-nowrap'
						>
							Delete '{selectedWorkout}'
						</button>
					)}
				</div>

				<div className='flex flex-wrap items-center gap-4'>
					<div className='flex-grow min-w-[200px]'>
						<label htmlFor='workout-name-input' className='sr-only'>
							New Workout Name
						</label>
						<input
							id='workout-name-input'
							placeholder='Or enter new workout name...'
							className='w-full px-4 py-2 border border-secondary rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white text-gray-700'
							value={workoutName}
							onChange={(e) => setWorkoutName(e.target.value)}
						/>
					</div>
					<button
						onClick={addWorkout}
						disabled={!workoutName.trim()}
						className={`px-4 py-2 bg-primary text-white rounded-md font-semibold shadow-sm hover:bg-opacity-80 transition duration-150 ease-in-out whitespace-nowrap ${
							!workoutName.trim() ? 'opacity-50 cursor-not-allowed' : ''
						}`}
					>
						Add Workout +
					</button>
				</div>
			</div>

			<hr className='border-secondary border-opacity-50' />

			<div>
				<h2 className='text-xl font-semibold text-primary mb-4'>
					Exercises in Workout
				</h2>
				{localExercises.length > 0 ? (
					<div className='flex flex-wrap gap-4'>
						{localExercises.map((exercise) => (
							<ExerciseItem
								key={exercise._id}
								item={exercise}
								addOrDelete={'delete'}
							/>
						))}
					</div>
				) : (
					<p className='text-gray-400 italic'>
						No exercises added to this workout yet.
					</p>
				)}
			</div>

			<hr className='border-secondary border-opacity-50' />

			<div className='flex justify-end'>
				<button
					onClick={pushLocalWorkoutChanges}
					disabled={!selectedWorkout && !workoutName}
					className={`px-6 py-3 bg-primary text-white rounded-md font-semibold shadow-lg hover:bg-opacity-80 transition duration-150 ease-in-out text-lg ${
						!selectedWorkout && !workoutName
							? 'opacity-50 cursor-not-allowed'
							: ''
					}`}
				>
					Save Workout Changes
				</button>
			</div>
		</div>
	);
}
