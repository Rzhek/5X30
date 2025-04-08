import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { callPost } from '../util/external-api.service';

export default function Header() {
	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();

	async function saveUserToDb() {
		const token = await getAccessTokenSilently();
		const apiServerUrl = import.meta.env.VITE_API_SERVER_URL;
		if (user?.email) {
			await callPost({
				url: `${apiServerUrl}/api/createUser`,
				body: { email: user.email },
				token: token,
			});
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			saveUserToDb();
		}
	}, [isAuthenticated]);

	return (
		<header className='flex justify-between items-center bg-secondary pl-16 pr-16 p-6'>
			<Link to='/' className='text-4xl font-bold text-primary p-4 rounded-xl'>
				5X30
			</Link>
			{!isAuthenticated ? (
				''
			) : (
				<nav className='flex list-none flex-row gap-4'>
					<Link to='/analytics' className='text-xl'>
						Analytics
					</Link>
					<Link to='/workouts' className='text-xl'>
						Log Workouts
					</Link>
					<Link to='/exercises' className='text-xl'>
						Manage Workouts
					</Link>
				</nav>
			)}

			<div className='flex justfity-between items-center gap-4'>
				{!isAuthenticated ? (
					<>
						<button
							className='bg-accent font-bold p-2 rounded-lg cursor-pointer'
							onClick={() => loginWithRedirect()}
						>
							Sign In
						</button>
					</>
				) : (
					<>
						<p>Welcome, {user.name}</p>
						<button
							className='bg-accent p-2 rounded-lg cursor-pointer'
							onClick={logout}
						>
							Log Out
						</button>
					</>
				)}
			</div>
		</header>
	);
}
