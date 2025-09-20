import { useState } from "react";

// Simple curriculum builder component
const CurriculumBuilder = () => {
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");

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

        <div className="flex justify-center">
          <button
            onClick={generateModule}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Generate Module
          </button>
        </div>

        {moduleTitle && (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module Title</label>
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module Description
              </label>
              <textarea
                value={moduleDescription}
                onChange={(e) => setModuleDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumBuilder;
