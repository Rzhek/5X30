import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import { useAuth0 } from '@auth0/auth0-react';

import AnalyticsPage from './components/AnalyticsPage';
import WorkoutsPage from './components/WorkoutsPage';
import ExercisesPage from './components/ExercisesPage';
import { ToastContainer } from 'react-toastify';

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
        <ToastContainer
          position='bottom-right'
          autoClose={3000}
          closeOnClick={true}
          theme='dark'
        />
      </Router>
    </>
  );
}

export default App;
