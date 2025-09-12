// Simple monitoring utility
const monitoring = {
  logEvent: (event, data) => {
    console.log(`[Monitoring] ${event}:`, data);
  },

  trackPerformance: (name, duration) => {
    console.log(`[Performance] ${name}: ${duration}ms`);
  },

  reportError: (error) => {
    console.error(`[Error] ${error.message}`, error);
  },
};

export default monitoring;
