import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import { callExternalApi } from './util/external-api.service';
import { useAuth0 } from '@auth0/auth0-react';

import AnalyticsPage from './components/AnalyticsPage';
import WorkoutsPage from './components/WorkoutsPage';
import ExercisesPage from './components/ExercisesPage';

function App() {
	const {
		loginWithRedirect,
		logout,
		user,
		isAuthenticated,
		getAccessTokenSilently,
	} = useAuth0();

	return (
		<>
			<Router>
				<Header />
				<Routes>
					<Route path='/' element={<WelcomePage />}></Route>
					<Route path='/analytics' element={<AnalyticsPage />}></Route>
					<Route path='/workouts' element={<WorkoutsPage />}></Route>
					<Route path='/exercises' element={<ExercisesPage />}></Route>
				</Routes>
			</Router>
		</>
	);
}

export default App;
