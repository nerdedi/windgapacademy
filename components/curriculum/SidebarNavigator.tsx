import React from "react";

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
}

interface SidebarNavigatorProps {
  modules: Module[];
  activeModuleId: string;
  activeLessonId: string;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
}

/**
 * Navigation sidebar for curriculum structure
 * Displays modules and lessons with add/edit functionality
 */
const SidebarNavigator: React.FC<SidebarNavigatorProps> = ({
  modules,
  activeModuleId,
  activeLessonId,
  onModuleSelect,
  onLessonSelect,
  onAddModule,
  onAddLesson,
}) => {
  return (
    <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Curriculum</h2>
        <p className="text-sm text-gray-500">Modules and lessons</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {modules.map((module) => (
          <div key={module.id} className="mb-3">
            <div
              className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                activeModuleId === module.id ? "bg-blue-100" : "hover:bg-gray-200"
              }`}
              onClick={() => onModuleSelect(module.id)}
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                <span className="font-medium text-gray-800 truncate">
                  {module.title || "Untitled Module"}
                </span>
              </div>
              <button
                className="p-1 rounded-full hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddLesson(module.id);
                }}
              >
                <svg
                  className="h-4 w-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {module.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className={`ml-4 p-2 rounded-md flex items-center cursor-pointer ${
                  activeLessonId === lesson.id ? "bg-blue-100" : "hover:bg-gray-200"
                }`}
                onClick={() => onLessonSelect(module.id, lesson.id)}
              >
                <svg
                  className="h-4 w-4 text-gray-400 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-700 truncate">
                  {lesson.title || "Untitled Lesson"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onAddModule}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200 flex items-center justify-center"
        >
          <svg
            className="h-5 w-5 mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Module
        </button>
      </div>
    </div>
  );
};

export default SidebarNavigator;
