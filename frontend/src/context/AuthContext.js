import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, loginUser as apiLogin, logoutUser as apiLogout } from '../api/auth/authRequests';
import apiClient from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error("Auth check failed:", error);
          await apiLogout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const { token, user: loggedInUser } = await apiLogin(credentials);
      if (token && loggedInUser) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', loggedInUser.role);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(loggedInUser);
        return loggedInUser;
      }
    } catch (error) {
      console.error("Login failed:", error);
      await apiLogout();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
  };

  const value = { user, setUser, login, logout, loading, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
