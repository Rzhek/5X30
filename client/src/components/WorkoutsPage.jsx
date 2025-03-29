import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import getUserWorkouts from '../util/getUserWorkouts';

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

	console.log(userWorkouts);
	return (
		<>
			<h1>Log your workouts</h1>

			<select
				name='Select Workout'
				id=''
				className='text-primary mb-10'
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

			{selectedWorkout != '' ? (
				<div>
					{userWorkouts
						.find((w) => w.name === selectedWorkout)
						.exercises.map((e) => (
							<>
								<p>{e.name}</p>
								<input className='bg-white text-black' type='number' />
							</>
						))}
				</div>
			) : (
				''
			)}
		</>
	);
}
