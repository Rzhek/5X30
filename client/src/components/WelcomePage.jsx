import { useAuth0 } from '@auth0/auth0-react';

export default function WelcomePage() {
	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();

	return (
		<div>
			<h1>Welcome to 5X30</h1>
			<p>The best training </p>
			<img className='w-xs' src='../../public/logo.webp' alt='' />
			<div>
				<button onClick={() => loginWithRedirect()}>Sign in</button>
				<button onClick={() => loginWithRedirect()}>Sign up</button>
			</div>
		</div>
	);
}
