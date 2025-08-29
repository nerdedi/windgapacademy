import React from "react";

export default function Tooltip({ text, children, className = "" }) {
  return (
    <span className={`relative group ${className}`}> 
      {children}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50" role="tooltip">
        {text}
      </span>
    </span>
  );
}
