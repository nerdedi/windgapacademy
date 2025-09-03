import * as React from "react";

export function Badge({ variant = "default", className = "", children, ...props }) {
  let base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  let variants = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-background text-foreground",
  };
  return (
    <span className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </span>
  );
}
