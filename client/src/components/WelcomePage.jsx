import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

export default function WelcomePage() {
	const { loginWithRedirect, isAuthenticated } = useAuth0();

	return (
		<div className='min-h-screen bg-background text-primary flex flex-col items-center justify-center p-8'>
			<h1 className='text-5xl font-extrabold mb-4 text-center'>
				Welcome to 5X30
			</h1>
			<p className='text-xl text-gray-300 mb-8 text-center max-w-2xl'>
				Your personal strength training companion. Designed to help you stay
				consistent, track progress, and push limits.
			</p>

			<div className='grid md:grid-cols-2 gap-8 max-w-4xl w-full'>
				<div className='bg-secondary p-6 rounded-2xl shadow-lg'>
					<h2 className='text-2xl font-semibold mb-2'>
						📋 Create & Manage Workouts
					</h2>
					<p className='text-gray-300'>
						Build your own custom workouts. Organize exercises, set targets, and
						manage everything in one place.
					</p>
				</div>

				<div className='bg-secondary p-6 rounded-2xl shadow-lg'>
					<h2 className='text-2xl font-semibold mb-2'>
						🏋️ Record Exercise Logs
					</h2>
					<p className='text-gray-300'>
						Log each workout session with details like sets, reps, and weights —
						all automatically saved.
					</p>
				</div>

				<div className='bg-secondary p-6 rounded-2xl shadow-lg'>
					<h2 className='text-2xl font-semibold mb-2'>
						📈 Visualize Your Progress
					</h2>
					<p className='text-gray-300'>
						View interactive charts tracking weight lifted, reps completed,
						muscle group usage, and more.
					</p>
				</div>

				<div className='bg-secondary p-6 rounded-2xl shadow-lg'>
					<h2 className='text-2xl font-semibold mb-2'>📚 Exercise Library</h2>
					<p className='text-gray-300'>
						Access a curated list of exercises with detailed instructions,
						target muscles, and form tips.
					</p>
				</div>
			</div>

			<div className='mt-12'>
				{!isAuthenticated ? (
					<button
						onClick={() => loginWithRedirect()}
						className='bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-lg transition duration-300'
					>
						Get Started
					</button>
				) : (
					<Link
						to='/workouts'
						className='bg-accent hover:bg-accent/80 text-white font-bold py-3 px-6 rounded-lg transition duration-300'
					>
						Go to Dashboard
					</Link>
				)}
			</div>
		</div>
	);
}
