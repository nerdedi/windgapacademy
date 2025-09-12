import { useState, useEffect } from "react";

// Simple analytics hook
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    completionRate: 0,
    averageScore: 0,
    loading: true,
  });

  useEffect(() => {
    // Simulate loading analytics data
    const timer = setTimeout(() => {
      setAnalytics({
        totalUsers: 1250,
        activeUsers: 89,
        completionRate: 78,
        averageScore: 85,
        loading: false,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return analytics;
};

export default useAnalytics;
