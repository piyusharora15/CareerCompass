import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --- fetchUser Function ---
  // 'useCallback' is a React hook that prevents this function from being recreated on every render, which is a performance optimization.
  const fetchUser = useCallback(async () => {
    // If there's no token, we can't fetch a user.
    if (token) {
      try {
        // We make a GET request to our new '/users/me' endpoint.
        // We must include the token in the 'Authorization' header so the backend knows who we are.
        const res = await axios.get("http://localhost:5000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // We store the user object from the response in our state.
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        // If the token is invalid or expired, the API call will fail. We should log the user out.
        logout();
      }
    }
    // After we've checked for a user (or confirmed there's no token), we set 'isAuthReady' to true.
    setIsAuthReady(true);
  }, [token]); // This function will re-run only if the 'token' changes.

  // --- useEffect Hook ---
  // This hook runs the 'fetchUser' function once when the component first loads.
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Simple user object from token, you can fetch more details if needed
        setUser({ id: decoded.id });
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setIsAuthReady(true);
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthReady, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
