import * as React from "react";

export function Progress({ value = 0, className = "", ...props }) {
  return (
    <div
      className={`relative w-full h-2 bg-muted rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
