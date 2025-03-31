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
			</select>
			<input
				placeholder='workout name'
				value={workoutName}
				onChange={(e) => setWorkoutName(e.target.value)}
			></input>
			<button onClick={addWorkout}>add workout +</button>

			{selectedWorkout != '' ? (
				<button className='ml-6' onClick={deleteWorkout}>
					Delete Workout
				</button>
			) : (
				''
			)}

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
			<button onClick={pushLocalWorkoutChanges}>save workout</button>
		</>
	);
}
