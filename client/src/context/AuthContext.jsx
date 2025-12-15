// client/src/context/AuthContext.jsx
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

  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsAuthReady(true);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // If token is invalid/expired, force logout
      logout();
    } finally {
      setIsAuthReady(true);
    }
  }, [token, logout]);

  useEffect(() => {
    setIsAuthReady(false);
    fetchUser();
  }, [fetchUser]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthReady(false); // so that fetchUser runs with new token
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthReady,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};