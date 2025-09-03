import { useEffect } from "react";

/**
 * useAnalytics
 * - eventName: string
 * - eventData: object
 * - sender: optional function to send analytics (defaults to console.log)
 *
 * The hook is intentionally minimal so it can be swapped for GA/Segment/Amplitude later.
 */
export default function useAnalytics(eventName, eventData = {}, sender = null) {
  const payload = JSON.stringify(eventData);

  useEffect(() => {
    if (!eventName) return;

    const send =
      typeof sender === "function"
        ? sender
        : (name, data) => console.log("Analytics event:", name, data);

    try {
      send(eventName, eventData);
    } catch (err) {
      // avoid crashing the UI if analytics throws
      // eslint-disable-next-line no-console
      console.error("Analytics send failed", err);
    }
  }, [eventName, payload, sender, eventData]);
}
