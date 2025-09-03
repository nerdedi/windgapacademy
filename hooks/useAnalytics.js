import { useEffect, useRef } from "react";

/**
 * useAnalytics
 * - eventName: string
 * - eventData: object
 * - sender: optional function to send analytics (defaults to console.log)
 *
 * The hook is intentionally minimal so it can be swapped for GA/Segment/Amplitude later.
 */
export default function useAnalytics(eventName, eventData = {}, sender = null, options = {}) {
  const { debounceMs = 0 } = options || {};
  const payload = JSON.stringify(eventData);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!eventName) return;

    const send =
      typeof sender === "function"
        ? sender
        : (name, data) => console.log("Analytics event:", name, data);

    const doSend = () => {
      try {
        send(eventName, eventData);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Analytics send failed", err);
      }
    };

    if (debounceMs > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => doSend(), debounceMs);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }

    doSend();
    return undefined;
    // payload covers eventData; include sender, debounceMs and eventData explicitly
  }, [eventName, payload, sender, debounceMs, eventData]);
}
