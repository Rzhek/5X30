import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ExerciseItem from './ExerciseItem';
import { ContextLocalExercises } from './ContextLocalExercises';
import { callGet } from '../util/external-api.service';

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

		setSelectedWorkout('');
		getUserWorkouts().then((data) => {
			setUserWorkouts(data);
		});
	};

	return (
		<div className='p-6 space-y-6 bg-base-100 rounded-xl shadow-md'>
			<div className='space-y-2'>
				<label
					htmlFor='workout-select'
					className='text-secondary font-semibold'
				>
					Choose a Workout
				</label>
				<select
					id='workout-select'
					className='select select-bordered w-full text-primary'
					value={selectedWorkout}
					onChange={(e) => setSelectedWorkout(e.target.value)}
				>
					<option value='' disabled>
						Select workout
					</option>
					{userWorkouts.map((w) => (
						<option key={w._id} value={w.name}>
							{w.name}
						</option>
					))}
				</select>
			</div>

			<div className='flex items-end gap-4'>
				<div className='flex-1'>
					<label
						htmlFor='workout-name'
						className='text-secondary font-semibold'
					>
						New Workout Name
					</label>
					<input
						id='workout-name'
						placeholder='Workout name'
						className='input input-bordered w-full text-primary'
						value={workoutName}
						onChange={(e) => setWorkoutName(e.target.value)}
					/>
				</div>
				<button onClick={addWorkout} className='btn btn-accent'>
					Add Workout +
				</button>
			</div>

			<div className='flex justify-between items-center'>
				{selectedWorkout !== '' && (
					<button onClick={deleteWorkout} className='btn btn-error'>
						Delete Workout
					</button>
				)}
				<button
					onClick={pushLocalWorkoutChanges}
					className='btn btn-primary ml-auto'
				>
					Save Workout
				</button>
			</div>

			<div className='divider'>Exercises</div>

			<div className='flex flex-wrap gap-4'>
				{localExercises.map((exercise) => (
					<ExerciseItem
						key={exercise._id}
						item={exercise}
						addOrDelete='delete'
					/>
				))}
			</div>
		</div>
	);
}
