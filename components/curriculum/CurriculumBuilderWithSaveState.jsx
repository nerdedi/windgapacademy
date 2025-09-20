import { useState, useEffect } from "react";
import Modal from "../ui/Modal";

// Enhanced curriculum builder component with save state functionality
const CurriculumBuilder = () => {
  // Core curriculum state
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const [assessmentStrategy, setAssessmentStrategy] = useState("");

  // Save state related state
  const [savedStates, setSavedStates] = useState([]);
  const [currentSaveName, setCurrentSaveName] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);

  const subjects = [
    "Mathematics",
    "Science",
    "History",
    "Language Arts",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Social Studies",
    "Geography",
  ];

  // Load saved states from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("windgap-curriculum-saves");
    if (savedData) {
      try {
        setSavedStates(JSON.parse(savedData));
      } catch (error) {
        console.error("Error loading saved states:", error);
        // Initialize with empty array if there's an error
        setSavedStates([]);
      }
    }
  }, []);

  // Save current state to localStorage
  const saveCurrentState = () => {
    // Don't save if no name is provided
    if (!currentSaveName.trim()) return;

    const newState = {
      id: Date.now().toString(),
      name: currentSaveName,
      timestamp: new Date().toISOString(),
      data: {
        selectedSubject,
        moduleTitle,
        moduleDescription,
        learningObjectives,
        assessmentStrategy,
      },
    };

    // Check if a save with this name already exists
    const existingIndex = savedStates.findIndex((state) => state.name === currentSaveName);
    let updatedStates;

    if (existingIndex >= 0) {
      // Update existing save
      updatedStates = [...savedStates];
      updatedStates[existingIndex] = newState;
    } else {
      // Add new save
      updatedStates = [...savedStates, newState];
    }

    // Update state and localStorage
    setSavedStates(updatedStates);
    localStorage.setItem("windgap-curriculum-saves", JSON.stringify(updatedStates));

    // Close modal and reset name
    setShowSaveModal(false);
    setCurrentSaveName("");
  };

  // Load a saved state
  const loadState = (savedState) => {
    const { data } = savedState;

    // Restore all saved values
    setSelectedSubject(data.selectedSubject || "Mathematics");
    setModuleTitle(data.moduleTitle || "");
    setModuleDescription(data.moduleDescription || "");
    setLearningObjectives(data.learningObjectives || "");
    setAssessmentStrategy(data.assessmentStrategy || "");

    // Close modal
    setShowLoadModal(false);
  };

  // Delete a saved state
  const deleteState = () => {
    if (!stateToDelete) return;

    const updatedStates = savedStates.filter((state) => state.id !== stateToDelete.id);
    setSavedStates(updatedStates);
    localStorage.setItem("windgap-curriculum-saves", JSON.stringify(updatedStates));

    // Close confirmation
    setShowDeleteConfirmation(false);
    setStateToDelete(null);
  };

  // Confirm deletion of a state
  const confirmDelete = (state) => {
    setStateToDelete(state);
    setShowDeleteConfirmation(true);
  };

  // Generate module (existing functionality)
  const generateModule = () => {
    setModuleTitle(`${selectedSubject} - Interactive Learning Module`);
    setModuleDescription(
      `A comprehensive ${selectedSubject} module with interactive content and assessments.`,
    );
    alert("Module generated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Curriculum Builder</h1>

      {/* Save/Load Controls */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => setShowLoadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          disabled={savedStates.length === 0}
        >
          Load
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Save
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Select Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Module Title</label>
          <input
            type="text"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="Enter module title"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Module Description</label>
          <textarea
            value={moduleDescription}
            onChange={(e) => setModuleDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="Describe the module"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Learning Objectives</label>
          <textarea
            value={learningObjectives}
            onChange={(e) => setLearningObjectives(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="List learning objectives"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Assessment Strategy</label>
          <textarea
            value={assessmentStrategy}
            onChange={(e) => setAssessmentStrategy(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="Describe assessment methods"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={generateModule}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-md"
          >
            Generate Module
          </button>
        </div>

        {moduleTitle && (
          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h3 className="text-xl font-bold text-gray-800">{moduleTitle}</h3>
            <p className="mt-2 text-gray-600">{moduleDescription}</p>
          </div>
        )}
      </div>

      {/* Save Modal */}
      <Modal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)}>
        <h2 className="text-xl font-bold mb-4">Save Your Work</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Save Name</label>
          <input
            type="text"
            value={currentSaveName}
            onChange={(e) => setCurrentSaveName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="My Curriculum Plan"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowSaveModal(false)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveCurrentState}
            disabled={!currentSaveName.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            Save
          </button>
        </div>
      </Modal>

      {/* Load Modal */}
      <Modal isOpen={showLoadModal} onClose={() => setShowLoadModal(false)}>
        <h2 className="text-xl font-bold mb-4">Load Saved Work</h2>
        {savedStates.length === 0 ? (
          <p className="text-gray-600">No saved work found.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {savedStates.map((state) => (
              <div key={state.id} className="flex items-center justify-between p-2 border-b">
                <div>
                  <h3 className="font-medium">{state.name}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(state.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadState(state)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => confirmDelete(state)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-4">
          Are you sure you want to delete "{stateToDelete?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowDeleteConfirmation(false)}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={deleteState}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CurriculumBuilder;
