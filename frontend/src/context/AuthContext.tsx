'use client';

import { createContext, useContext, useState, useEffect } from "react";
import { fetcher } from "@/utils/api"; // Assume fetcher is your API utility

// Create a context for the isLoggedIn state and token validation
export const AuthContext = createContext({
  isLoggedIn: false,          // Default value for login status
  username: "",               // Default value for the username
  setIsLoggedIn: (value: boolean) => {},  // Function to update login state
  validateToken: async () => {}  // Function to validate the token
});

// Custom hook to use AuthContext in your components
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps your app with AuthContext
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Function to validate the token and update the login state
  const validateToken = async () => {
    try {
      const data = await fetcher("/validate-token", { method: "GET" });
      setIsLoggedIn(true);
      setUsername(data.username);
    } catch {
      setIsLoggedIn(false);
      setUsername("");
    }
  };

  // Automatically validate the token when the app starts
  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, setIsLoggedIn, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
}
