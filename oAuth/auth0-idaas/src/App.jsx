
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    isLoading
  } = useAuth0();

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '80px' }}>
      <h1>Auth0 IDaaS Application</h1>

      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>
          Login
        </button>
      ) : (
        <>
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>

          {user.picture && (
            <img
              src={user.picture}
              alt="Profile"
              width="100"
            />
          )}

          <br /><br />

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin
                }
              })
            }
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default App;
