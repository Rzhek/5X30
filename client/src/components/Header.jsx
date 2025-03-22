import { useAuth0 } from '@auth0/auth0-react';

export default function Header() {
	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();
	return (
		<header className='flex justify-between items-center bg-slate-800 pl-16 pr-16 p-6'>
			<p className='text-4xl font-bold text-blue-600 bg-white p-4 rounded-xl'>
				5X30
			</p>
			<nav className='flex justfity-between items-center gap-4'>
				{!isAuthenticated ? (
					<>
						<button
							className='bg-blue-600 p-2 rounded-lg cursor-pointer'
							onClick={() => loginWithRedirect()}
						>
							Sign In
						</button>
					</>
				) : (
					<>
						<p>Welcome, {user.name}</p>
						<button
							className='bg-blue-600 p-2 rounded-lg cursor-pointer'
							onClick={logout}
						>
							Log Out
						</button>
					</>
				)}
			</nav>
		</header>
	);
}
