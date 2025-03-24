import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function Header() {
	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();

	return (
		<header className='flex justify-between items-center bg-secondary pl-16 pr-16 p-6'>
			<Link to='/' className='text-4xl font-bold text-primary p-4 rounded-xl'>
				5X30
			</Link>
			<nav className='flex list-none flex-row gap-4'>
				<Link to='/analytics' className='text-xl'>
					Analytics
				</Link>
				<Link to='/workouts' className='text-xl'>
					Track workouts
				</Link>
				<Link to='/exercises' className='text-xl'>
					Exercises
				</Link>
			</nav>

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
