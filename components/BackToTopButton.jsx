import React, { useEffect, useState } from "react";

export default function BackToTopButton({ className = "" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;
  return (
    <button
      className={`back-to-top fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-3 shadow-lg transition-opacity duration-300 ${className}`}
      style={{ zIndex: 1000 }}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      &#8679;
    </button>
  );
}
