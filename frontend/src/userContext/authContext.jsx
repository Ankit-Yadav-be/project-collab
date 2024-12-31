import React, { createContext, useContext, useState, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user data from localStorage (if available) on component mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Function to update the user
  const updateUser = (userData) => {
    console.log("Updating user:", userData); // Debugging log
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save to localStorage
  };

  // Function to clear the user
  const clearUser = () => {
    console.log("Clearing user"); // Debugging log
    setUser(null);
    localStorage.removeItem("user"); // Remove from localStorage
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the UserContext
export const useUser = () => useContext(UserContext);
