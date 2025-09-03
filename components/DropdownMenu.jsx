import React, { useState, useRef, useEffect } from "react";

export default function DropdownMenu({ label, children, className = "" }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        className="dropdown-toggle px-4 py-2 bg-blue-500 text-white rounded"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
      </button>
      {open && (
        <div
          className="dropdown-menu absolute left-0 mt-2 w-48 bg-white border rounded shadow z-40"
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
}
