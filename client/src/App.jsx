import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import { callExternalApi } from './util/external-api.service';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();

	// async function test() {
	// 	const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
	// 	const token = await getAccessTokenSilently();
	// 	console.log(token);
	// 	const config = {
	// 		url: `${apiServerUrl}/api/yesauth`,
	// 		method: 'GET',
	// 		headers: {
	// 			'content-type': 'application/json',
	// 			Authorization: `Bearer ${token}`,
	// 		},
	// 	};

	// 	const { data, error } = await callExternalApi({ config });
	// 	console.log(data, error);
	// }
	console.log(user);
	return (
		<Header />
		// <>
		// 	{!isAuthenticated ? (
		// 		<WelcomePage />
		// 	) : (
		// 		<>
		// 			<button
		// 				onClick={() =>
		// 					logout({ logoutParams: { returnTo: window.location.origin } })
		// 				}
		// 			>
		// 				Logout
		// 			</button>
		// 			<p>Welcome, {user.name}</p>
		// 		</>
		// 	)}
		// </>
	);
}

export default App;
