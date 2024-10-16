import React, { useState, createContext } from 'react';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin@123') {
      setIsAuthenticated(true); // Successfully authenticated
    } else {
      alert('Invalid login credentials');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
