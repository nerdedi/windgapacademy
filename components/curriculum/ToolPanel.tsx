import React from "react";

interface ToolPanelProps {
  onAddInteractive: () => void;
  onAddMedia: () => void;
  onAddAssessment: () => void;
  onToggleVisibility: () => void;
  isVisible: boolean;
}

/**
 * Sidebar tool panel for curriculum builder
 * Provides access to interactive elements, media, and assessments
 */
const ToolPanel: React.FC<ToolPanelProps> = ({
  onAddInteractive,
  onAddMedia,
  onAddAssessment,
  onToggleVisibility,
  isVisible,
}) => {
  if (!isVisible) {
    return (
      <button
        onClick={onToggleVisibility}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-l-md shadow-md border border-gray-200 border-r-0"
        title="Open Tools"
      >
        <svg
          className="h-5 w-5 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="w-64 bg-gray-100 border-l border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Tools</h2>
        <button
          onClick={onToggleVisibility}
          className="p-1 rounded-full hover:bg-gray-200"
          title="Close Tools"
        >
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Interactive Elements</h3>
          <div className="space-y-2">
            <button
              onClick={onAddInteractive}
              className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-blue-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>3D Model Viewer</span>
            </button>
            <button className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span>Interactive Graph</span>
            </button>
            <button className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
              <svg
                className="h-5 w-5 text-purple-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Drag & Drop Activity</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Media</h3>
          <div className="space-y-2">
            <button
              onClick={onAddMedia}
              className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-red-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Video</span>
            </button>
            <button className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
              <svg
                className="h-5 w-5 text-yellow-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Image Gallery</span>
            </button>
            <button className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
              <svg
                className="h-5 w-5 text-cyan-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <span>Audio Player</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Assessments</h3>
          <div className="space-y-2">
            <button
              onClick={onAddAssessment}
              className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-indigo-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Quiz</span>
            </button>
            <button className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
              <svg
                className="h-5 w-5 text-orange-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Assignment</span>
            </button>
            <button className="w-full flex items-center p-2 bg-white rounded-md border border-gray-300 hover:bg-gray-50">
              <svg
                className="h-5 w-5 text-pink-500 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span>Discussion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;
