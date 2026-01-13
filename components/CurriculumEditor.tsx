import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";

import type { CurriculumTopic } from "./curriculumTypes";

type Props = { topic: CurriculumTopic };

// Helper function to ensure proper metadata structure
const normalizeTopicMetadata = (topic: CurriculumTopic): CurriculumTopic => ({
  ...topic,
  title: topic.title ?? "",
  acsfSkills: Array.isArray(topic.acsfSkills) ? topic.acsfSkills : [],
});

export default function CurriculumEditor({ topic }: Props) {
  // Ensure defaults to avoid uncontrolled → controlled warnings
  const [metadata, setMetadata] = useState<CurriculumTopic>(() => normalizeTopicMetadata(topic));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Keep state in sync if the topic prop changes
  useEffect(() => {
    setMetadata(normalizeTopicMetadata(topic));
  }, [topic]);

  const handleSave = useCallback(async () => {
    // Enhanced form validation
    if (!metadata.topicId?.trim()) {
      setMessage("Missing topicId.");
      return;
    }
    if (!metadata.title?.trim()) {
      setMessage("Title is required.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const db = getFirestore();
      const ref = doc(db, "curriculum", metadata.topicId);
      // Use merge to preserve fields that aren't present in metadata
      await setDoc(ref, metadata, { merge: true });
      setMessage("Curriculum saved successfully!");
    } catch (err: unknown) {
      console.error("Save error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(`Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  }, [metadata]);

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMetadata((prev) => ({ ...prev, title: value }));
      // Clear validation message when user starts typing
      if (message && message.includes("Title is required")) {
        setMessage(null);
      }
    },
    [message],
  );

  const onSkillsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setMetadata((prev) => ({ ...prev, acsfSkills: values }));
  }, []);

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Edit Curriculum Metadata</h2>

      <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700">
          Title{" "}
          <span className="text-red-500" aria-label="required">
            *
          </span>
        </span>
        <input
          type="text"
          className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            !metadata.title?.trim() && message?.includes("Title is required")
              ? "border-red-300 bg-red-50"
              : "border-gray-300"
          }`}
          value={metadata.title}
          onChange={onTitleChange}
          aria-label="Curriculum title"
          aria-required="true"
          placeholder="Enter curriculum title"
          required
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
        <span className="block mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</span>
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
        disabled={saving || !metadata.title?.trim()}
        className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-busy={saving}
        title={!metadata.title?.trim() ? "Please enter a title before saving" : ""}
      >
        {saving ? "Saving..." : "Save Curriculum"}
      </button>
    </div>
  );
}
