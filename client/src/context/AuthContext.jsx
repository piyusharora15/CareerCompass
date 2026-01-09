import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthReady(true);
  }, []);

  const fetchUser = useCallback(async (tokenOverride) => {
    const activeToken = tokenOverride || token;
    
    if (!activeToken) {
      setUser(null);
      setIsAuthReady(true);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/users/me", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setUser(res.data);
      setIsAuthReady(true); // Set ready only AFTER user is found
    } catch (error) {
      console.error("Auth Error:", error.response?.data || error.message);
      logout();
    }
  }, [token, logout]);

  // Initial load check
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (newToken) => {
    setIsAuthReady(false); // Block routes while fetching new user data
    localStorage.setItem("token", newToken);
    setToken(newToken);
    
    // We await the fetch to ensure 'user' state is populated before redirect
    await fetchUser(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthReady, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};