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

interface CurriculumSidebarProps {
  modules: Module[];
  activeModuleId: string;
  activeLessonId: string;
  onModuleSelect: (moduleId: string) => void;
  onLessonSelect: (moduleId: string, lessonId: string) => void;
  onAddModule: () => void;
  onAddLesson: (moduleId: string) => void;
}

/**
 * Sidebar component for the Curriculum Builder
 * Displays and manages modules and lessons structure
 */
const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
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
        <h2 className="text-lg font-medium text-gray-900">Curriculum Structure</h2>
        <p className="text-sm text-gray-500">Manage modules and lessons</p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {modules.map((module) => (
          <div key={module.id} className="mb-3">
            <div
              id={`module-${module.id}`}
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span className="font-medium text-gray-800 truncate max-w-[140px]">
                  {module.title || "Untitled Module"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-2">{module.lessons.length}</span>
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
            </div>

            {module.lessons.map((lesson) => (
              <div
                key={lesson.id}
                id={`lesson-${lesson.id}`}
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
                <span className="text-sm text-gray-700 truncate max-w-[160px]">
                  {lesson.title || "Untitled Lesson"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-gray-200">
        <button
          id="add-module-button"
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

export default CurriculumSidebar;
