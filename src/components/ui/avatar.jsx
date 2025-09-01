import * as React from "react";

export function Avatar({ className = "", children, ...props }) {
  return (
    <span className={`inline-block rounded-full overflow-hidden bg-muted ${className}`} {...props}>
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt = "", className = "", ...props }) {
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className}`} {...props} />;
}

export function AvatarFallback({ className = "", children, ...props }) {
  return (
    <span className={`flex items-center justify-center w-full h-full bg-primary text-primary-foreground ${className}`} {...props}>
      {children}
    </span>
  );
}
