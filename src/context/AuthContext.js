import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Example user object: { role: 'admin' | 'learner' | 'educator', name: '...' }
  // Backwards compatible: also supports legacy 'student' | 'trainer' roles
  const [user, setUser] = useState(null);

  // Replace with real login logic
  const login = (role, name) => {
    setUser({ role, name });
  };
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};
