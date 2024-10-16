import React, { useContext } from 'react';
import AuthContext from './components/AuthContext';
import EventList from './components/EventList';
import Login from './components/Login';
import EventDetail from './components/EventDetail';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="App">
      {isAuthenticated ? (
        // Show EventList if user is authenticated
        <EventList />
      ) : (
        // Otherwise, show Login page
        <Login />
      )}
    </div>
  );
};

export default App;
