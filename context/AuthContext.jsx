// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('ppe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    // Mock authentication - in real app, call API
    if (username && password) {
      const userData = {
        id: 1,
        username,
        name: username === 'admin' ? 'Admin User' : 'Safety Manager',
        role: username === 'admin' ? 'admin' : 'manager',
        email: `${username}@miningcompany.com`,
        department: 'Safety Department',
        avatar: username.charAt(0).toUpperCase()
      };
      
      setUser(userData);
      localStorage.setItem('ppe_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ppe_user');
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};