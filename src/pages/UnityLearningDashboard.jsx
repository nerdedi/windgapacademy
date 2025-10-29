import { useEffect, useState } from "react";

import ProgressTracker from "../components/ProgressTracker";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UnityExperienceDemo from "../components/UnityExperienceDemo";
import { useAuth } from "../contexts/AuthContext";
import { getProgressData } from "../utils/ProgressService";

/**
 * UnityLearningDashboard - Example page that demonstrates how to use the
 * Unity integration components in a learning platform context
 */
const UnityLearningDashboard = () => {
  const { currentUser } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [userProgress, setUserProgress] = useState({});

  // Fetch available experiences and user progress
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // In a real application, you would fetch this data from your database
        // This is mock data for demonstration purposes
        const mockExperiences = [
          {
            id: "physics-playground",
            title: "Physics Playground",
            description: "Learn physics concepts through interactive experiments",
            buildUrl: "/unity-integration/builds/physics-playground",
            lessonId: "physics-101",
            thumbnail: "/assets/images/physics-playground.jpg",
            category: "Science",
          },
          {
            id: "math-adventure",
            title: "Math Adventure",
            description: "Master mathematics through engaging puzzles and challenges",
            buildUrl: "/unity-integration/builds/math-adventure",
            lessonId: "algebra-basics",
            thumbnail: "/assets/images/math-adventure.jpg",
            category: "Mathematics",
          },
          {
            id: "history-explorer",
            title: "History Explorer",
            description: "Travel through time and explore historical events",
            buildUrl: "/unity-integration/builds/history-explorer",
            lessonId: "ancient-civilizations",
            thumbnail: "/assets/images/history-explorer.jpg",
            category: "History",
          },
        ];

        setExperiences(mockExperiences);

        // Fetch progress data for each experience
        const progressData = {};
        for (const exp of mockExperiences) {
          try {
            const data = await getProgressData(currentUser.uid, exp.id, exp.lessonId);
            progressData[exp.id] = data || { progress: 0 };
          } catch (err) {
            console.error(`Failed to load progress for ${exp.id}:`, err);
            progressData[exp.id] = { progress: 0, error: true };
          }
        }

        setUserProgress(progressData);
      } catch (err) {
        console.error("Failed to load experiences:", err);
        setError("Failed to load educational experiences. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Handle experience selection
  const handleSelectExperience = (experienceId) => {
    const experience = experiences.find((exp) => exp.id === experienceId);
    setSelectedExperience(experience);
    // Scroll to the experience player
    document.getElementById("experience-player")?.scrollIntoView({ behavior: "smooth" });
  };

  // Format progress percentage
  const formatProgress = (progress) => {
    if (typeof progress === "number") {
      return `${Math.round(progress * 100)}%`;
    }
    return "0%";
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
        <p className="ml-3">Loading learning dashboard...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg m-6">
        <h2 className="text-red-800 text-xl mb-3">Error</h2>
        <p className="text-red-600">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Render login prompt if user is not authenticated
  if (!currentUser) {
    return (
      <div className="bg-blue-50 p-6 rounded-lg m-6">
        <h2 className="text-blue-800 text-xl mb-3">Authentication Required</h2>
        <p className="text-blue-600">Please sign in to access the learning dashboard.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            /* Handle login */
          }}
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="learning-dashboard container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Learning Dashboard</h1>
        <p className="text-gray-600">
          Explore interactive educational experiences and track your progress
        </p>
      </header>

      {/* Progress Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <ProgressTracker userId={currentUser.uid} showFilters={true} className="mb-8" />
      </section>

      {/* Experience Library */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Educational Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${experience.thumbnail})` }}
              >
                {!experience.thumbnail && (
                  <div className="h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-lg">{experience.title}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="text-sm font-medium text-blue-600 mb-2 block">
                  {experience.category}
                </span>
                <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                <p className="text-gray-600 mb-4">{experience.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Progress:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: userProgress[experience.id]?.progress
                            ? formatProgress(userProgress[experience.id].progress)
                            : "0%",
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {userProgress[experience.id]?.progress
                        ? formatProgress(userProgress[experience.id].progress)
                        : "0%"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectExperience(experience.id)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {userProgress[experience.id]?.progress > 0 ? "Continue" : "Start Learning"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Selected Experience Player */}
      {selectedExperience && (
        <section id="experience-player" className="mb-12 scroll-mt-4">
          <h2 className="text-2xl font-semibold mb-4">{selectedExperience.title}</h2>
          <UnityExperienceDemo
            experienceId={selectedExperience.id}
            lessonId={selectedExperience.lessonId}
            title={selectedExperience.title}
            description={selectedExperience.description}
            buildUrl={selectedExperience.buildUrl}
            height="700px"
          />
        </section>
      )}
    </div>
  );
};

export default UnityLearningDashboard;
