import React, { useState } from "react";

export default function Carousel({ items, renderItem, className = "", autoPlay = true, interval = 3000 }) {
  const [current, setCurrent] = useState(0);
  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  return (
    <div className={`carousel relative overflow-hidden ${className}`} aria-label="Carousel">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${current * 100}%)` }}>
        {items.map((item, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2"
        onClick={() => setCurrent((current - 1 + items.length) % items.length)}
        aria-label="Previous"
      >
        &#8592;
      </button>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2"
        onClick={() => setCurrent((current + 1) % items.length)}
        aria-label="Next"
      >
        &#8594;
      </button>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full ${idx === current ? "bg-blue-500" : "bg-gray-300"}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
