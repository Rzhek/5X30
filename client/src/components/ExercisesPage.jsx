import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ExerciseItem from './ExerciseItem';
import WorkoutSelect from './WorkoutSelect';
import { ContextLocalExercises } from './ContextLocalExercises';
import { callPost } from '../util/external-api.service';

export default function ExercisesPage() {
	const [name, setName] = useState('');
	const [exercises, setExercises] = useState([]);

	const [localExercises, setLocalExercises] = useState([]);

	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();

	const getExercises = async (e) => {
		e.preventDefault();
		const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
		const token = await getAccessTokenSilently();

		const { data, error } = await callPost({
			url: `${apiServerUrl}/api/getExercise`,
			body: { name: name },
			token: token,
		});

		if (error) {
			console.log(error);
			return;
		}

		setExercises(data);
	};

	return (
		<ContextLocalExercises.Provider
			value={{ localExercises, setLocalExercises }}
		>
			<div className='m-8'>
				<WorkoutSelect />
				<h1 className='text-4xl font-bold text-primary mb-6'>Exercises</h1>

				<form
					onSubmit={(e) => getExercises(e)}
					className='flex items-center space-x-4 bg-secondary p-4 rounded-lg shadow-md mb-6'
				>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Search exercises...'
						className='flex-1 p-2 rounded-lg bg-white text-black border border-primary focus:outline-none focus:ring-2 focus:ring-primary'
					/>
					<button
						type='submit'
						className='bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-80 transition duration-300'
					>
						🔍
					</button>
				</form>

				<div className='flex flex-wrap gap-6'>
					{exercises
						.filter((e) => localExercises.every((ex) => ex._id !== e._id))
						.map((item) => (
							<ExerciseItem key={item._id} item={item} />
						))}
				</div>
			</div>
		</ContextLocalExercises.Provider>
	);
}
