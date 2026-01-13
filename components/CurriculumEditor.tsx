import { doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";

import type { CurriculumTopic } from "./curriculumTypes";

type Props = { topic: CurriculumTopic };

// Move helper function outside component to prevent recreation
const normalizeTopicMetadata = (topic: CurriculumTopic): CurriculumTopic => ({
  ...topic,
  title: topic.title ?? "",
  acsfSkills: Array.isArray(topic.acsfSkills) ? topic.acsfSkills : [],
});

// Constants for better maintainability
const ACSF_SKILLS_OPTIONS = [
  "Reading",
  "Writing",
  "Oral Communication",
  "Numeracy",
  "Learning",
] as const;

const AUTO_SAVE_DELAY = 2000; // 2 seconds

export default function CurriculumEditor({ topic }: Props) {
  // Ensure defaults to avoid uncontrolled → controlled warnings
  const [metadata, setMetadata] = useState<CurriculumTopic>(() => normalizeTopicMetadata(topic));
  const [originalMetadata, setOriginalMetadata] = useState<CurriculumTopic>(() =>
    normalizeTopicMetadata(topic),
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if form has unsaved changes
  const hasUnsavedChanges = isDirty && !saving;

  // Keep state in sync if the topic prop changes
  useEffect(() => {
    const normalizedTopic = normalizeTopicMetadata(topic);
    setMetadata(normalizedTopic);
    setOriginalMetadata(normalizedTopic);
    setIsDirty(false);
  }, [topic]);

  // Check if metadata has changed from original
  const checkDirtyState = useCallback(
    (newMetadata: CurriculumTopic) => {
      const isDifferent = JSON.stringify(newMetadata) !== JSON.stringify(originalMetadata);
      setIsDirty(isDifferent);
    },
    [originalMetadata],
  );

  const handleSave = useCallback(
    async (isAutoSave = false) => {
      // Enhanced form validation
      if (!metadata.topicId?.trim()) {
        if (!isAutoSave) setMessage("Missing topicId.");
        return;
      }
      if (!metadata.title?.trim()) {
        if (!isAutoSave) setMessage("Title is required.");
        return;
      }

      setSaving(true);
      if (!isAutoSave) setMessage(null);

      try {
        const db = getFirestore();
        const ref = doc(db, "curriculum", metadata.topicId);
        // Use merge to preserve fields that aren't present in metadata
        await setDoc(ref, metadata, { merge: true });

        setOriginalMetadata(metadata);
        setIsDirty(false);

        if (isAutoSave) {
          setMessage("Auto-saved ✓");
          // Clear auto-save message after 2 seconds
          setTimeout(() => setMessage(null), 2000);
        } else {
          setMessage("Curriculum saved successfully!");
        }
      } catch (err: unknown) {
        console.error("Save error:", err);
        const msg = err instanceof Error ? err.message : String(err);
        setMessage(`Save failed: ${msg}`);
      } finally {
        setSaving(false);
      }
    },
    [metadata],
  );

  // Auto-save functionality
  useEffect(() => {
    if (isDirty && metadata.topicId?.trim() && metadata.title?.trim()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleSave(true); // Pass true for auto-save
      }, AUTO_SAVE_DELAY);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [metadata, isDirty, handleSave]);

  // Warn user about unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const onTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const newMetadata = { ...metadata, title: value };
      setMetadata(newMetadata);
      checkDirtyState(newMetadata);

      // Clear validation message when user starts typing
      if (message && message.includes("Title is required")) {
        setMessage(null);
      }
    },
    [message, metadata, checkDirtyState],
  );

  const onSkillsChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const values = Array.from(e.target.selectedOptions, (o) => o.value);
      const newMetadata = { ...metadata, acsfSkills: values };
      setMetadata(newMetadata);
      checkDirtyState(newMetadata);
    },
    [metadata, checkDirtyState],
  );

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "s") {
          e.preventDefault();
          handleSave();
        }
      }
    },
    [handleSave],
  );

  return (
    <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Edit Curriculum Metadata</h2>
        {isDirty && (
          <span className="text-xs text-orange-600 font-medium" title="Unsaved changes">
            ● Unsaved
          </span>
        )}
      </div>

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
          {ACSF_SKILLS_OPTIONS.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
        <span className="block mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</span>
      </label>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.startsWith("Save failed")
              ? "bg-red-100 text-red-700"
              : message.includes("Auto-saved")
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
          }`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <div className="space-y-2">
        <button
          onClick={() => handleSave()}
          disabled={saving || !metadata.title?.trim()}
          className="w-full px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-busy={saving}
          title={!metadata.title?.trim() ? "Please enter a title before saving" : "Ctrl+S"}
        >
          {saving ? "Saving..." : "Save Curriculum"}
        </button>

        <p className="text-xs text-center text-gray-500">
          Auto-saves after 2 seconds of inactivity • Press Ctrl+S to save manually
        </p>
      </div>
    </div>
  );
}
