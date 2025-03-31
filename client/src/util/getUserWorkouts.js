import { callGet } from './external-api.service';

export default async function getUserWorkouts(token, user) {
	// const res = await axios.get('http://localhost:6060/api/getUsersWorkouts', {
	// 	params: {
	// 		userEmail: user.email,
	// 	},
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: `Bearer ${token}`,
	// 	},
	// });
	const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;

	const res = await callGet({
		url: `${apiServerUrl}/api/getUsersWorkouts`,
		params: { userEmail: user.email },
		token: token,
	});
	return res.data;
}
