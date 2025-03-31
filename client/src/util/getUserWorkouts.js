import axios from 'axios';

export default async function getUserWorkouts(token, user) {
	const res = await axios.get('http://localhost:6060/api/getUsersWorkouts', {
		params: {
			userEmail: user.email,
		},
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	return res.data;
}
