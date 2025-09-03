import React, { useEffect, useState } from "react";

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch("/api/materials")
      .then((res) => res.json())
      .then(setMaterials);
  }, []);

  return (
    <div className="study-materials mb-6 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-2">Study Materials</h2>
      <ul>
        {materials.length === 0 ? (
          <li>No materials available</li>
        ) : (
          materials.map((m) => (
            <li key={m.id} className="py-1">
              {m.title}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default StudyMaterials;
