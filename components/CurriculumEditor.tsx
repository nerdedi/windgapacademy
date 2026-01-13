import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import type { CurriculumTopic } from "./curriculumTypes";

type Props = { topic: CurriculumTopic };

export default function CurriculumEditor({ topic }: Props) {
  // Ensure defaults to avoid uncontrolled → controlled warnings
  const [metadata, setMetadata] = useState<CurriculumTopic>({
    ...topic,
    title: topic.title ?? "",
    acsfSkills: Array.isArray(topic.acsfSkills) ? topic.acsfSkills : [],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Keep state in sync if the topic prop changes
  useEffect(() => {
    setMetadata({
      ...topic,
      title: topic.title ?? "",
      acsfSkills: Array.isArray(topic.acsfSkills) ? topic.acsfSkills : [],
    });
  }, [topic]);

  const handleSave = async () => {
    if (!metadata.topicId) {
      setMessage("Missing topicId.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const db = getFirestore();
      const ref = doc(db, "curriculum", metadata.topicId);
      // Use merge to preserve fields that aren't present in metadata
      await setDoc(ref, metadata, { merge: true });
      setMessage("Saved successfully.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata((prev) => ({ ...prev, title: e.target.value }));
  };

  const onSkillsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setMetadata((prev) => ({ ...prev, acsfSkills: values }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Curriculum Metadata</h2>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">Title</span>
        <input
          type="text"
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={metadata.title}
          onChange={onTitleChange}
          aria-label="Curriculum title"
          placeholder="Enter curriculum title"
        />
      </label>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">ACSF Skills</span>
        <select
          multiple
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
          value={metadata.acsfSkills}
          onChange={onSkillsChange}
          aria-label="Select ACSF skills"
        >
          <option value="Reading">Reading</option>
          <option value="Writing">Writing</option>
          <option value="Oral Communication">Oral Communication</option>
          <option value="Numeracy">Numeracy</option>
          <option value="Learning">Learning</option>
        </select>
        <span className="text-xs text-gray-500 mt-1 block">Hold Ctrl/Cmd to select multiple</span>
      </label>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${message.startsWith("Save failed") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
        aria-busy={saving}
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
