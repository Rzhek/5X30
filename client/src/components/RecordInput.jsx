import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';
import { callPost } from '../util/external-api.service';

export default function RecordInput({ name, id }) {
	const [weight, setWeight] = useState(0);
	const [reps, setReps] = useState(0);
	const { user, getAccessTokenSilently } = useAuth0();

	const uploadRecord = async () => {
		const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
		const token = await getAccessTokenSilently();
		const res = await callPost({
			url: `${apiServerUrl}/api/addRecord`,
			body: {
				reps: reps,
				weight: weight,
				forExercise: id,
				userEmail: user?.email,
			},
			token: token,
		});
		if (res.status === 200) {
			setWeight(0);
			setReps(0);
		}
	};

	return (
		<div key={name} className='bg-gray-500 p-6 rounded-xl mb-4'>
			<h4>{name}</h4>
			<label htmlFor={`${name}-weight`}>Weight: </label>
			<input
				id={`${name}-weight`}
				type='number'
				value={weight}
				onChange={(e) => setWeight(e.target.value)}
			/>
			<label htmlFor={`${name}-reps`}>Reps: </label>
			<input
				id={`${name}-reps`}
				type='number'
				value={reps}
				onChange={(e) => setReps(e.target.value)}
			/>
			<button onClick={uploadRecord}>Submit</button>
		</div>
	);
}
