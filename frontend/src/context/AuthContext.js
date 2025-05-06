import React, { createContext, useState, useEffect, useContext } from 'react';
import { ROLES } from '../constants/roles';

// Dummy IDs should match the ones the backend middleware uses.
const DUMMY_BUYER_ID = "60b8d2958b26c41f5c7ceee1";
const DUMMY_SELLER_ID = "60b8d2958b26c41f5c7ceee2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user role is stored in localStorage
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      const dummyUser = {
        _id: storedRole === ROLES.SELLER ? DUMMY_SELLER_ID : DUMMY_BUYER_ID,
        role: storedRole,
        email: "",
        name: storedRole === ROLES.SELLER ? "Demo Seller" : "Demo Buyer"
      };
      setUser(dummyUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async ({ email, password, role }) => {
    // For testing, simply store the role and create a dummy user.
    localStorage.setItem('userRole', role);
    const dummyUser = {
      _id: role === ROLES.SELLER ? DUMMY_SELLER_ID : DUMMY_BUYER_ID,
      role,
      email,
      name: role === ROLES.SELLER ? "Demo Seller" : "Demo Buyer"
    };
    setUser(dummyUser);
    setIsAuthenticated(true);
    return dummyUser;
  };

  const logout = () => {
    localStorage.removeItem('userRole');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
