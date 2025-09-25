import { useEffect, useState } from "react";

/**
 * CurriculumBuilderWithSaveState - A component for building curriculum with state persistence
 *
 * This is a placeholder implementation that can be expanded with actual functionality.
 */
const CurriculumBuilderWithSaveState = () => {
  const [curriculum, setCurriculum] = useState({
    title: "New Curriculum",
    description: "Description of the curriculum",
    modules: [],
  });

  const [isSaved, setIsSaved] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  // Effect to handle auto-saving
  useEffect(() => {
    if (!isSaved) {
      const timeoutId = setTimeout(() => {
        saveCurrentState();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [curriculum, isSaved]);

  // Mock function for saving curriculum state
  const saveCurrentState = () => {
    console.log("Saving curriculum state:", curriculum);
    // In a real implementation, this would save to Firebase or another backend
    localStorage.setItem("curriculum-draft", JSON.stringify(curriculum));
    setIsSaved(true);
    setLastSaved(new Date());
  };

  // Mock function for adding a module
  const addModule = () => {
    setCurriculum((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: Date.now().toString(),
          title: `Module ${prev.modules.length + 1}`,
          lessons: [],
        },
      ],
    }));
    setIsSaved(false);
  };

  // Mock function for updating curriculum title
  const updateTitle = (newTitle) => {
    setCurriculum((prev) => ({ ...prev, title: newTitle }));
    setIsSaved(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Curriculum Builder</h1>
        <div className="flex items-center">
          <span className={`mr-2 ${isSaved ? "text-green-500" : "text-yellow-500"}`}>
            {isSaved ? "Saved" : "Unsaved changes"}
          </span>
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Curriculum Title</label>
        <input
          type="text"
          value={curriculum.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          value={curriculum.description}
          onChange={(e) => {
            setCurriculum((prev) => ({ ...prev, description: e.target.value }));
            setIsSaved(false);
          }}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-medium mb-2">Modules</h2>
        {curriculum.modules.length === 0 ? (
          <p className="text-gray-500">No modules yet. Add your first module!</p>
        ) : (
          <ul className="space-y-2">
            {curriculum.modules.map((module) => (
              <li key={module.id} className="p-3 border rounded bg-gray-50">
                <h3 className="font-medium">{module.title}</h3>
                <p className="text-sm text-gray-500">{module.lessons.length} lessons</p>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={addModule}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Module
        </button>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveCurrentState}
          disabled={isSaved}
          className={`px-4 py-2 rounded ${
            isSaved
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CurriculumBuilderWithSaveState;
