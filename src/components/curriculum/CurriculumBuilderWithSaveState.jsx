import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const STORAGE_KEY = "curriculum-draft";
const SCHEMA_VERSION = 1;

export default function CurriculumBuilderWithSaveState() {
  const [curriculum, setCurriculum] = useState({
    version: SCHEMA_VERSION,
    title: "New Curriculum",
    description: "Description of the curriculum",
    modules: [],
  });
  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimer = useRef(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === SCHEMA_VERSION) {
          setCurriculum(parsed);
          setLastSaved(new Date());
        }
      }
    } catch (_) {
      // Ignore parsing errors
    }
  }, []);

  // Debounced auto-save
  useEffect(() => {
    if (isSaved) return; // only schedule when there are unsaved changes
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculum));
        setIsSaved(true);
        setLastSaved(new Date());
      } catch (e) {
        console.error("Failed to save draft", e);
      }
    }, 1500);
    return () => saveTimer.current && clearTimeout(saveTimer.current);
  }, [curriculum, isSaved]);

  const addModule = () => {
    setCurriculum((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        { id: Date.now().toString(), title: `Module ${prev.modules.length + 1}`, lessons: [] },
      ],
    }));
    setIsSaved(false);
  };

  const updateTitle = (newTitle) => {
    setCurriculum((prev) => ({ ...prev, title: newTitle }));
    setIsSaved(false);
  };

  const updateDescription = (newDesc) => {
    setCurriculum((prev) => ({ ...prev, description: newDesc }));
    setIsSaved(false);
  };

  const manualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(curriculum));
      setIsSaved(true);
      setLastSaved(new Date());
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">Curriculum Builder</h2>
      <div className="text-sm mb-4">
        <span className={isSaved ? "text-green-600" : "text-yellow-600"}>
          {isSaved ? "Saved" : "Unsaved changes"}
        </span>
        {lastSaved && (
          <span className="ml-2 text-gray-600">Last saved: {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>

      <label className="block text-sm font-medium mb-1">Curriculum Title</label>
      <input
        value={curriculum.title}
        onChange={(e) => updateTitle(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea
        value={curriculum.description}
        onChange={(e) => updateDescription(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={3}
      />

      <div className="flex gap-2 mb-6">
        <Button variant="secondary" onClick={addModule}>
          Add Module
        </Button>
        <Button variant="default" onClick={manualSave}>
          Save Changes
        </Button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Modules</h3>
      {curriculum.modules.length === 0 ? (
        <div className="text-gray-700">No modules yet. Add your first module!</div>
      ) : (
        <ul className="space-y-2">
          {curriculum.modules.map((module) => (
            <li key={module.id} className="p-3 rounded border">
              <div className="font-semibold">{module.title}</div>
              <div className="text-sm text-gray-600">{module.lessons.length} lessons</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
