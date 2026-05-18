import * as React from "react";

export function Button({ variant = "default", size = "md", className = "", children, ...props }) {
  let base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  let variants = {
    default: "bg-[#0B6E8F] text-white hover:bg-[#095a74]",
    outline:
      "border-2 border-[#0B6E8F] bg-white text-[#0B6E8F] hover:bg-[#0B6E8F] hover:text-white",
    ghost: "bg-transparent text-[#0B6E8F] hover:bg-[#0B6E8F]/10",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-[#a32c2b] text-white hover:bg-[#8b2120]",
  };
  let sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base",
  };
  return (
    <button
      className={`${base} ${variants[variant] || ""} ${sizes[size] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
