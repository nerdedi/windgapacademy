import React from 'react';

// Array of image data for dynamic rendering
const images = [
  {
    src: 'assets/images/natalie.png',
    alt: 'Natalie, Windgap Academy staff member in a pinstripe suit with gold jewelry and W badge.',
  },
  {
    src: 'assets/images/daisy_andy.png',
    alt: 'Daisy and Andy, Windgap Academy students standing side by side. Daisy is wearing a red Windgap Academy sweater and Andy is in a teal WAL sweater.',
  },
  {
    src: 'assets/images/winnie.png',
    alt: 'Winnie, a friendly cloud character with teal hair, smiling and waving, wearing yellow and white sneakers.',
  },
  {
    src: 'assets/images/windgap_building.png',
    alt: 'Windgap Academy building.',
  },
  {
    src: 'assets/images/aud_notes.png',
    alt: 'Illustration of Australian currency notes.',
  },
  {
    src: 'assets/images/daisy.png',
    alt: 'Daisy, a student at Windgap Academy, wearing academy attire.',
  },
  {
    src: 'assets/images/andy.png',
    alt: 'Andy, a student at Windgap Academy, wearing WAL sweater.',
  },
];

const CharacterGallery = () => (
  <div className="character-gallery">
    {images.map((img, idx) => (
      <img
        key={idx}
        src={img.src}
        alt={img.alt}
        style={{ maxWidth: '250px', margin: '16px', borderRadius: '12px' }}
      />
    ))}
  </div>
);

export default CharacterGallery;
