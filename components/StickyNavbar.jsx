import React, { useEffect, useState } from "react";

export default function StickyNavbar({ children, className = "" }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky-top transition-all duration-300 ${isSticky ? "top-0" : "-top-24"} z-50 ${className}`}
      style={{ position: "sticky" }}
      aria-label="Main Navigation"
    >
      {children}
    </nav>
  );
}
