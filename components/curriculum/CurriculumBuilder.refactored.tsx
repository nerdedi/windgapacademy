// Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
import React, { useState, useEffect, useContext } from "react";
import { useFirestore } from "../../hooks/useFirestore";
import { AuthContext } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

// Import extracted components
import CurriculumHeader from "./CurriculumHeader";
import CurriculumSidebar from "./CurriculumSidebar";
import CurriculumContent from "./CurriculumContent";
import AchievementNotification from "./AchievementNotification";
import { createParticleEffect, createRippleEffect } from "./utils/VisualEffects";
import ActivityDesigner from "./ActivityDesigner";

/**
 * CurriculumBuilder
 *
 * Main component for building and editing curriculum content.
 * This refactored version breaks down the original large component
 * into smaller, more manageable components.
 */
const CurriculumBuilder: React.FC = () => {
  // Authentication and user context
  const { currentUser } = useContext(AuthContext);
  const { addDocument, updateDocument, getDocument } = useFirestore("curriculums");

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showTools, setShowTools] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");

  // Curriculum data state
  const [curriculumId, setCurriculumId] = useState("");
  const [curriculumTitle, setCurriculumTitle] = useState("New Curriculum");
  const [modules, setModules] = useState<any[]>([]);
  const [activeModuleId, setActiveModuleId] = useState("");
  const [activeLessonId, setActiveLessonId] = useState("");
  const [activeContent, setActiveContent] = useState<any>(null);

  // Initialize or load curriculum
  useEffect(() => {
    const currId = new URLSearchParams(window.location.search).get("id");

    if (currId) {
      setCurriculumId(currId);
      loadCurriculum(currId);
    } else {
      // Initialize new curriculum
      initNewCurriculum();
    }
  }, []);

  // Load curriculum data from Firestore
  const loadCurriculum = async (id: string) => {
    setIsLoading(true);

    try {
      const curriculum = await getDocument(id);

      if (curriculum) {
        setCurriculumTitle(curriculum.title);
        setModules(curriculum.modules || []);

        // Set active module/lesson if available
        if (curriculum.modules && curriculum.modules.length > 0) {
          setActiveModuleId(curriculum.modules[0].id);

          if (curriculum.modules[0].lessons && curriculum.modules[0].lessons.length > 0) {
            setActiveLessonId(curriculum.modules[0].lessons[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error loading curriculum:", error);
      // Show error notification
    }

    setIsLoading(false);
  };

  // Initialize a new curriculum
  const initNewCurriculum = () => {
    const newModuleId = uuidv4();
    const newLessonId = uuidv4();

    const initialModules = [
      {
        id: newModuleId,
        title: "Module 1",
        description: "",
        order: 1,
        lessons: [
          {
            id: newLessonId,
            title: "Lesson 1",
            content: "",
            order: 1,
          },
        ],
      },
    ];

    setModules(initialModules);
    setActiveModuleId(newModuleId);
    setActiveLessonId(newLessonId);
  };

  // Update active content when selection changes
  useEffect(() => {
    if (activeModuleId && !activeLessonId) {
      // Module is selected
      const module = modules.find((m) => m.id === activeModuleId);
      if (module) {
        setActiveContent({
          id: module.id,
          title: module.title,
          content: module.description || "",
          type: "module",
        });
      }
    } else if (activeModuleId && activeLessonId) {
      // Lesson is selected
      const module = modules.find((m) => m.id === activeModuleId);
      if (module) {
        const lesson = module.lessons.find((l: any) => l.id === activeLessonId);
        if (lesson) {
          setActiveContent({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content || "",
            type: "lesson",
          });
        }
      }
    } else {
      setActiveContent(null);
    }
  }, [activeModuleId, activeLessonId, modules]);

  // Save curriculum to Firestore
  const saveCurriculum = async () => {
    setIsLoading(true);

    try {
      const curriculumData = {
        title: curriculumTitle,
        modules: modules,
        updatedAt: new Date(),
        updatedBy: currentUser?.uid,
      };

      if (curriculumId) {
        await updateDocument(curriculumId, curriculumData);
      } else {
        curriculumData.createdAt = new Date();
        curriculumData.createdBy = currentUser?.uid;
        const docRef = await addDocument(curriculumData);
        setCurriculumId(docRef.id);

        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set("id", docRef.id);
        window.history.pushState({}, "", url);
      }

      // Show success effect
      createRippleEffect("save-button");
      showAchievementNotification("Curriculum saved successfully!");
    } catch (error) {
      console.error("Error saving curriculum:", error);
      // Show error notification
    }

    setIsLoading(false);
  };

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId("");
    createRippleEffect(`module-${moduleId}`);
  };

  // Handle lesson selection
  const handleLessonSelect = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    createRippleEffect(`lesson-${lessonId}`);
  };

  // Add a new module
  const handleAddModule = () => {
    const newModuleId = uuidv4();

    const newModule = {
      id: newModuleId,
      title: `Module ${modules.length + 1}`,
      description: "",
      order: modules.length + 1,
      lessons: [],
    };

    setModules([...modules, newModule]);
    setActiveModuleId(newModuleId);
    setActiveLessonId("");

    // Show visual effect
    createParticleEffect("add-module-button");
  };

  // Add a new lesson to a module
  const handleAddLesson = (moduleId: string) => {
    const newLessonId = uuidv4();

    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        const newLesson = {
          id: newLessonId,
          title: `Lesson ${module.lessons.length + 1}`,
          content: "",
          order: module.lessons.length + 1,
        };

        return {
          ...module,
          lessons: [...module.lessons, newLesson],
        };
      }

      return module;
    });

    setModules(updatedModules);
    setActiveModuleId(moduleId);
    setActiveLessonId(newLessonId);

    // Show visual effect
    createParticleEffect(`module-${moduleId}`);
  };

  // Update content (module description or lesson content)
  const handleContentChange = (content: string) => {
    if (activeContent?.type === "module") {
      const updatedModules = modules.map((module) => {
        if (module.id === activeModuleId) {
          return {
            ...module,
            description: content,
          };
        }
        return module;
      });

      setModules(updatedModules);
    } else if (activeContent?.type === "lesson") {
      const updatedModules = modules.map((module) => {
        if (module.id === activeModuleId) {
          const updatedLessons = module.lessons.map((lesson: any) => {
            if (lesson.id === activeLessonId) {
              return {
                ...lesson,
                content: content,
              };
            }
            return lesson;
          });

          return {
            ...module,
            lessons: updatedLessons,
          };
        }
        return module;
      });

      setModules(updatedModules);
    }
  };

  // Update title (module title or lesson title)
  const handleTitleChange = (title: string) => {
    if (activeContent?.type === "module") {
      const updatedModules = modules.map((module) => {
        if (module.id === activeModuleId) {
          return {
            ...module,
            title: title,
          };
        }
        return module;
      });

      setModules(updatedModules);
    } else if (activeContent?.type === "lesson") {
      const updatedModules = modules.map((module) => {
        if (module.id === activeModuleId) {
          const updatedLessons = module.lessons.map((lesson: any) => {
            if (lesson.id === activeLessonId) {
              return {
                ...lesson,
                title: title,
              };
            }
            return lesson;
          });

          return {
            ...module,
            lessons: updatedLessons,
          };
        }
        return module;
      });

      setModules(updatedModules);
    }
  };

  // Show achievement notification with animation
  const showAchievementNotification = (message: string) => {
    setAchievementMessage(message);
    setShowAchievement(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowAchievement(false);
    }, 3000);
  };

  // Add interactive element to content
  const handleAddInteractive = () => {
    if (!activeContent) return;

    const interactiveCode = `
<div class="interactive-element" data-type="3d-model">
  <div class="model-container" style="height: 400px; width: 100%; background: #f0f0f0; border-radius: 8px;">
    <!-- 3D Model Container -->
    <div class="model-placeholder">3D Model Viewer</div>
  </div>
  <div class="controls">
    <button class="rotate-left">Rotate Left</button>
    <button class="zoom-in">Zoom In</button>
    <button class="zoom-out">Zoom Out</button>
    <button class="rotate-right">Rotate Right</button>
  </div>
</div>
    `;

    handleContentChange(activeContent.content + interactiveCode);
    createParticleEffect("interactive-button");
    showAchievementNotification("Interactive element added!");
  };

  // Add media element to content
  const handleAddMedia = () => {
    if (!activeContent) return;

    const mediaCode = `
<div class="media-element" data-type="video">
  <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px;">
    <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="Video Player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  </div>
  <p class="caption">Video caption goes here</p>
</div>
    `;

    handleContentChange(activeContent.content + mediaCode);
    createRippleEffect("media-button");
    showAchievementNotification("Media element added!");
  };

  // Add assessment element to content
  const handleAddAssessment = () => {
    if (!activeContent) return;

    const assessmentCode = `
<div class="assessment-element" data-type="quiz">
  <h3 class="quiz-title">Quiz: Knowledge Check</h3>
  <div class="quiz-question">
    <p>What is the main purpose of this curriculum?</p>
    <div class="quiz-options">
      <div class="option"><input type="radio" name="q1" id="q1a"><label for="q1a">Option A</label></div>
      <div class="option"><input type="radio" name="q1" id="q1b"><label for="q1b">Option B</label></div>
      <div class="option"><input type="radio" name="q1" id="q1c"><label for="q1c">Option C</label></div>
      <div class="option"><input type="radio" name="q1" id="q1d"><label for="q1d">Option D</label></div>
    </div>
  </div>
  <button class="submit-quiz">Submit Answer</button>
</div>
    `;

    handleContentChange(activeContent.content + assessmentCode);
    createParticleEffect("assessment-button");
    showAchievementNotification("Assessment element added!");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with title and save button */}
      <CurriculumHeader
        title={curriculumTitle}
        onTitleChange={setCurriculumTitle}
        onSave={saveCurriculum}
        isLoading={isLoading}
      />

      {/* Main content area with sidebar, editor, and tools */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar for navigation */}
        <CurriculumSidebar
          modules={modules}
          activeModuleId={activeModuleId}
          activeLessonId={activeLessonId}
          onModuleSelect={handleModuleSelect}
          onLessonSelect={handleLessonSelect}
          onAddModule={handleAddModule}
          onAddLesson={handleAddLesson}
        />

        {/* Main editor panel */}
        <CurriculumContent
          activeContent={activeContent}
          onContentChange={handleContentChange}
          onTitleChange={handleTitleChange}
          onAddInteractive={handleAddInteractive}
          onAddMedia={handleAddMedia}
          onAddAssessment={handleAddAssessment}
        />

        {/* Right sidebar for tools */}
        <ToolPanel
          onAddInteractive={handleAddInteractive}
          onAddMedia={handleAddMedia}
          onAddAssessment={handleAddAssessment}
          onToggleVisibility={() => setShowTools(!showTools)}
          isVisible={showTools}
        />
      </div>

      {/* Achievement notification */}
      {showAchievement && <AchievementNotification message={achievementMessage} />}
    </div>
  );
};

export default CurriculumBuilder;
const CurriculumBuilder: React.FC = () => {
  // State declarations
  const [curriculum, setCurriculum] = useState({
    title: "New Curriculum",
    description: "",
    modules: [],
    targetSkills: [],
    difficultyLevel: "beginner",
    estimatedDuration: 0,
    authorId: "",
  });

  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [activeActivity, setActiveActivity] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      type: "xp" | "badge" | "level" | "coin";
      value?: number;
    }>
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState(curriculumCharacters[0]);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const particleEffectRef = useRef<any>(null);
  const modelViewerRef = useRef<any>(null);

  // Effect for initializing visual effects
  useEffect(() => {
    if (containerRef.current) {
      // Initialize particle effect
      particleEffectRef.current = createParticleEffect("curriculum-particles", {
        particleCount: 50,
        color: "#3b82f6",
        size: 2,
        speed: 0.2,
      });

      // Initialize 3D character model
      if (selectedCharacter && selectedCharacter.modelPath) {
        modelViewerRef.current = initializeModelViewer(
          "character-container",
          selectedCharacter.modelPath,
          { autoRotate: true },
        );
      }
    }

    return () => {
      // Cleanup effects
      if (particleEffectRef.current && particleEffectRef.current.destroy) {
        particleEffectRef.current.destroy();
      }

      if (modelViewerRef.current && modelViewerRef.current.cleanup) {
        modelViewerRef.current.cleanup();
      }
    };
  }, [selectedCharacter]);

  // Handler for adding new modules
  const handleAddModule = useCallback(() => {
    setCurriculum((prev) => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: `module-${Date.now()}`,
          title: `Module ${prev.modules.length + 1}`,
          activities: [],
        },
      ],
    }));

    // Show achievement notification
    const notificationId = `notification-${Date.now()}`;
    setNotifications((prev) => [
      ...prev,
      {
        id: notificationId,
        title: "Module Created",
        description: "You've created a new module!",
        type: "xp",
        value: 10,
      },
    ]);

    // Create a ripple effect at cursor position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      createRippleEffect("curriculum-ripples", {
        x: rect.width / 2,
        y: rect.height / 2,
        color: "#60a5fa",
      });
    }
  }, []);

  // Handler for removing a notification
  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Function for saving curriculum
  const saveCurriculum = async () => {
    try {
      setIsLoading(true);

      // Example save operation - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success notification
      const notificationId = `notification-${Date.now()}`;
      setNotifications((prev) => [
        ...prev,
        {
          id: notificationId,
          title: "Curriculum Saved",
          description: "Your curriculum has been saved successfully!",
          type: "badge",
        },
      ]);

      setIsLoading(false);
    } catch (err) {
      setError("Failed to save curriculum. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="curriculum-builder w-full min-h-screen bg-gray-50 flex flex-col"
    >
      {/* Header */}
      <CurriculumHeader
        title={curriculum.title}
        onTitleChange={(title) => setCurriculum((prev) => ({ ...prev, title }))}
        onSave={saveCurriculum}
        isLoading={isLoading}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <CurriculumSidebar
          modules={curriculum.modules}
          activeModule={activeModule}
          activeActivity={activeActivity}
          onSelectModule={setActiveModule}
          onSelectActivity={setActiveActivity}
          onAddModule={handleAddModule}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
        />

        {/* Main content */}
        <div className="flex-1 overflow-auto p-6">
          {activeModule !== null && activeModule < curriculum.modules.length ? (
            <CurriculumContent
              module={curriculum.modules[activeModule]}
              activeActivity={activeActivity}
              onUpdateModule={(updatedModule) => {
                setCurriculum((prev) => ({
                  ...prev,
                  modules: prev.modules.map((m, i) => (i === activeModule ? updatedModule : m)),
                }));
              }}
              onSelectActivity={setActiveActivity}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                  Select a module or create a new one
                </h2>
                <p className="mt-2 text-gray-500">
                  Choose a module from the sidebar or create a new one to get started
                </p>
                <button
                  onClick={handleAddModule}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create New Module
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Activity Designer Panel - shown when editing an activity */}
        {activeModule !== null && activeActivity !== null && (
          <ActivityDesigner
            activity={curriculum.modules[activeModule].activities[activeActivity]}
            onUpdateActivity={(updatedActivity) => {
              const updatedModules = [...curriculum.modules];
              updatedModules[activeModule].activities[activeActivity] = updatedActivity;

              setCurriculum((prev) => ({
                ...prev,
                modules: updatedModules,
              }));
            }}
            onClose={() => setActiveActivity(null)}
          />
        )}
      </div>

      {/* Character model container */}
      <div id="character-container" className="fixed bottom-0 right-0 w-48 h-48 z-10" />

      {/* Particle effect container */}
      <div id="curriculum-particles" />

      {/* Ripple effect container */}
      <div id="curriculum-ripples" />

      {/* Achievement notifications */}
      {notifications.map((notification) => (
        <AchievementNotification
          key={notification.id}
          title={notification.title}
          description={notification.description}
          type={notification.type}
          value={notification.value}
          onClose={() => handleRemoveNotification(notification.id)}
        />
      ))}

      {/* Error message */}
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-50 border-l-4 border-red-400 p-4 z-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="pl-3">
              <div className="flex">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 focus:outline-none focus:text-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumBuilder;
