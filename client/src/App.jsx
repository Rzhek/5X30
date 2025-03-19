import logo from './logo.svg';
import './App.css';
import { callExternalApi } from './external-api.service';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  async function test() {
    const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
    const token = await getAccessTokenSilently();
    console.log(token);
    const config = {
      url: `${apiServerUrl}/api/yesauth`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, error } = await callExternalApi({ config });
    console.log(data, error);
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <button onClick={test}>TEST API</button>
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Login</button>
        ) : (
          <>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </button>
            <p>Welcome, {user.name}</p>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
