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

	const initialData = [
		{ date: new Date().getTime(), benchWeight: 100, benchReps: 10 },
		{ date: new Date().getTime() + 1000, squatWeight: 150, squatReps: 20 },
		{ date: new Date().getTime() + 2000, benchWeight: 110, benchReps: 12 },
	];

	return (
		<div className='m-8'>
			<h1>Analytics Page</h1>

			{userWorkouts.map((w) => (
				<WorkoutFullCard workout={w} />
			))}

			{userRecords.length ? <Chart data={userRecords} /> : ''}
		</div>
	);
}
