import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";

import type { CurriculumTopic } from "./curriculumTypes";

export default function CurriculumEditor({ topic }: { topic: CurriculumTopic }) {
  const [metadata, setMetadata] = useState<CurriculumTopic>(topic);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    const db = getFirestore();
    setDoc(doc(db, "curriculum", topic.topicId), metadata)
      .then(() => {
        setIsSaving(false);
      })
      .catch((error) => {
        console.error("Error saving curriculum metadata:", error);
        setIsSaving(false);
      });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {isSaving && <p>Saving...</p>}
      <h2>Edit Curriculum Metadata</h2>
      <label>Title:</label>
      <input
        type="text"
        value={metadata.title}
        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
      />
      <select
        multiple
        value={metadata.acsfSkills}
        aria-label="ACSF Skills"
        onChange={(e) =>
          setMetadata({
            ...metadata,
            acsfSkills: Array.from(e.target.selectedOptions).map((o) => o.value),
          })
        }
      >
        <option value="Reading">Reading</option>
        <option value="Writing">Writing</option>
        <option value="Oral Communication">Oral Communication</option>
        <option value="Numeracy">Numeracy</option>
        <option value="Learning">Learning</option>
      </select>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
