// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
import { useState } from "react";

/**
 * SensoryChecklist - An assessment form for learners to self-report sensory needs/preferences.
 * Can be assigned by educators and submitted by learners. Results can be stored in Firestore.
 */
const SENSORY_ITEMS = [
  {
    id: "reduceBrightness",
    label: "I prefer reduced screen brightness and contrast.",
  },
  {
    id: "reduceMotion",
    label: "I am sensitive to animations and motion effects.",
  },
  {
    id: "allowAudioControl",
    label: "I need to control or mute audio in lessons.",
  },
  {
    id: "muteBackground",
    label: "I prefer background sounds/music to be muted.",
  },
  {
    id: "reduceVisualClutter",
    label: "I benefit from a simplified, less cluttered interface.",
  },
  {
    id: "provideStimBreaks",
    label: "I need scheduled breaks for self-regulation (stimming).",
  },
  {
    id: "allowHyperfocusMode",
    label: "I benefit from a distraction-free (hyperfocus) mode.",
  },
];

const SensoryChecklist = ({ onSubmit, initialValues = {}, readOnly = false }) => {
  const [values, setValues] = useState(() => {
    const defaults = {};
    SENSORY_ITEMS.forEach((item) => {
      defaults[item.id] = initialValues[item.id] ?? false;
    });
    return defaults;
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (id) => (e) => {
    setValues((prev) => ({ ...prev, [id]: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (onSubmit) onSubmit(values);
  };

  return (
    <form
      className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto"
      onSubmit={handleSubmit}
      aria-label="Sensory Preferences Checklist"
    >
      <h2 className="text-2xl font-bold mb-4">Sensory Preferences Checklist</h2>
      <p className="mb-4 text-gray-600">
        Please indicate which sensory accommodations would help you learn best. Your responses will
        help your educator support your needs.
      </p>
      <ul className="space-y-3 mb-6">
        {SENSORY_ITEMS.map((item) => (
          <li key={item.id} className="flex items-center">
            <input
              type="checkbox"
              id={item.id}
              checked={!!values[item.id]}
              onChange={handleChange(item.id)}
              disabled={readOnly}
              className="mr-3 h-5 w-5 accent-indigo-600"
            />
            <label htmlFor={item.id} className="text-gray-800">
              {item.label}
            </label>
          </li>
        ))}
      </ul>
      {!readOnly && (
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          disabled={submitted}
        >
          {submitted ? "Submitted" : "Submit"}
        </button>
      )}
      {submitted && (
        <div className="mt-4 text-green-600 font-semibold">
          Thank you for submitting your preferences!
        </div>
      )}
    </form>
  );
};

export default SensoryChecklist;
