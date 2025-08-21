import React from "react";

// Array of image data for dynamic rendering
const images = [
  {
    src: "assets/images/natalie.png",
    alt: "Natalie, Windgap Academy staff member in a pinstripe suit with gold jewelry and W badge.",
  },
  {
    src: "assets/images/daisy_andy.png",
    alt: "Daisy and Andy, Windgap Academy students standing side by side. Daisy is wearing a red Windgap Academy sweater and Andy is in a teal WAL sweater.",
  },
  {
    src: "assets/images/winnie.png",
    alt: "Winnie, a friendly cloud character with teal hair, smiling and waving, wearing yellow and white sneakers.",
  },
  {
    src: "assets/images/windgap_building.png",
    alt: "Windgap Academy building.",
  },
  {
    src: "assets/images/aud_notes.png",
    alt: "Illustration of Australian currency notes.",
  },
  {
    src: "assets/images/daisy.png",
    alt: "Daisy, a student at Windgap Academy, wearing academy attire.",
  },
  {
    src: "assets/images/andy.png",
    alt: "Andy, a student at Windgap Academy, wearing WAL sweater.",
  },
];

import { useState } from "react";

const CharacterGallery = () => {
  const [selected, setSelected] = useState(null);
  const [customName, setCustomName] = useState("");
  return (
    <div className="character-gallery">
      {images.map((img, idx) => (
        <div key={idx} style={{ display: "inline-block", margin: "12px", textAlign: "center" }}>
          <img
            src={img.src}
            alt={img.alt}
            style={{
              maxWidth: "180px",
              margin: "8px",
              borderRadius: "12px",
              border: selected === idx ? "4px solid #3b82f6" : "2px solid #eee",
              cursor: "pointer",
            }}
            onClick={() => setSelected(idx)}
            tabIndex={0}
            aria-label={`Select ${img.alt}`}
            loading="lazy"
          />
          {selected === idx && (
            <div style={{ marginTop: "8px" }}>
              <input
                type="text"
                placeholder="Custom name..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                aria-label="Custom avatar name"
                style={{ padding: "4px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <div style={{ fontSize: "0.95em", color: "#3b82f6", marginTop: "4px" }}>
                Selected! {customName ? `Name: ${customName}` : ""}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CharacterGallery;
