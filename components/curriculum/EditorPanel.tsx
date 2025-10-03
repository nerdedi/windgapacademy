import React from "react";

interface EditorPanelProps {
  activeContent: {
    id: string;
    title: string;
    content: string;
    type: "module" | "lesson";
  } | null;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
}

/**
 * Main editor panel for curriculum content
 * Provides editing capabilities for module and lesson content
 */
const EditorPanel: React.FC<EditorPanelProps> = ({
  activeContent,
  onContentChange,
  onTitleChange,
}) => {
  if (!activeContent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No content selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a module or lesson from the sidebar to start editing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="p-6">
        <div className="mb-6">
          <label htmlFor="content-title" className="block text-sm font-medium text-gray-700 mb-1">
            {activeContent.type === "module" ? "Module Title" : "Lesson Title"}
          </label>
          <input
            id="content-title"
            type="text"
            value={activeContent.title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Enter ${activeContent.type} title`}
          />
        </div>

        <div>
          <label htmlFor="content-editor" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <div className="border border-gray-300 rounded-md shadow-sm">
            {/* This would be replaced with a rich text editor in a real implementation */}
            <textarea
              id="content-editor"
              value={activeContent.content}
              onChange={(e) => onContentChange(e.target.value)}
              rows={15}
              className="w-full p-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              placeholder={`Enter ${activeContent.type} content here...`}
            ></textarea>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Format using markdown or HTML. You can add images, videos, and interactive elements.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {activeContent.type === "module" ? "Module Settings" : "Lesson Settings"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
                Visibility
              </label>
              <select
                id="visibility"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>

            <div>
              <label htmlFor="access" className="block text-sm font-medium text-gray-700 mb-1">
                Access Level
              </label>
              <select
                id="access"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Students</option>
                <option value="enrolled">Enrolled Only</option>
                <option value="premium">Premium Members</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
