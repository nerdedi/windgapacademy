import { useState, useEffect } from "react";

// Simple auth hook
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    const timer = setTimeout(() => {
      // For now, simulate a logged-in educator
      setUser({
        id: "educator-1",
        name: "John Educator",
        email: "john@windgap.org.au",
        role: "educator",
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setUser({
        id: "user-1",
        name: credentials.name || "User",
        email: credentials.email,
        role: credentials.role || "learner",
      });
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };
};

export default useAuth;
