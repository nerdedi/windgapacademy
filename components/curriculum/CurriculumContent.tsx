import React from "react";
import { createGlowEffect } from "./utils/VisualEffects";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: "module" | "lesson";
}

interface CurriculumContentProps {
  activeContent: ContentItem | null;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
  onAddInteractive: () => void;
  onAddMedia: () => void;
  onAddAssessment: () => void;
}

/**
 * Main content editor for curriculum builder
 * Handles editing of module and lesson content
 */
const CurriculumContent: React.FC<CurriculumContentProps> = ({
  activeContent,
  onContentChange,
  onTitleChange,
  onAddInteractive,
  onAddMedia,
  onAddAssessment,
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
            onFocus={() => createGlowEffect("content-title")}
          />
        </div>

        <div className="mb-8">
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
              onFocus={() => createGlowEffect("content-editor")}
            ></textarea>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Format using markdown or HTML. You can add images, videos, and interactive elements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            id="interactive-button"
            onClick={onAddInteractive}
            className="flex items-center justify-center p-3 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition duration-200"
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
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Interactive Element
          </button>
          <button
            id="media-button"
            onClick={onAddMedia}
            className="flex items-center justify-center p-3 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition duration-200"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Add Media
          </button>
          <button
            id="assessment-button"
            onClick={onAddAssessment}
            className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition duration-200"
          >
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Add Assessment
          </button>
        </div>

        <div className="border-t border-gray-200 pt-6">
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

export default CurriculumContent;
