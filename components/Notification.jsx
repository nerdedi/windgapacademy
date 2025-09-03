import React from "react";

/**
 * Accessible notification component
 * Props:
 * - type: "info" | "success" | "error"
 * - message: string or node
 * - show: boolean
 */
export default function Notification({ type = "info", message = "", show = false }) {
  if (!show) return null;

  const role = type === "error" ? "alert" : "status";
  const ariaLive = type === "error" ? "assertive" : "polite";

  return (
    <div className={`notification ${type}`} role={role} aria-live={ariaLive} tabIndex={0}>
      {message}
    </div>
  );
}
