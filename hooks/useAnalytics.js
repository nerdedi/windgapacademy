import { useEffect } from "react";

export default function useAnalytics(eventName, eventData) {
  useEffect(() => {
    // Example: send event to analytics service
    if (eventName) {
      // window.analytics.track(eventName, eventData);
      // Replace with your analytics logic
      console.log("Analytics event:", eventName, eventData);
    }
  }, [eventName, eventData]);
}
