import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorAlert from "../components/ui/ErrorAlert";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import UnityExperienceDemo from "../components/UnityExperienceDemo";
import { useAuth } from "../contexts/AuthContext";
import { getExperienceById } from "../services/ExperiencesService";
import { getProgressData } from "../utils/ProgressService";

/**
 * LearningModule - A standalone page for a Unity educational experience
 * with progress tracking and interactive features.
 */
const LearningModule = () => {
  // Get the experienceId from URL params
  const { experienceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [relatedExperiences, setRelatedExperiences] = useState([]);

  // Refs
  const moduleRef = useRef(null);

  // Load experience data
  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) {
        setError("No experience ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch the experience data
        const data = await getExperienceById(experienceId);

        if (!data) {
          setError("Experience not found");
          setLoading(false);
          return;
        }

        setExperience(data);

        // If user is authenticated, fetch progress data
        if (currentUser) {
          const progress = await getProgressData(
            currentUser.uid,
            experienceId,
            data.defaultLessonId,
          );

          setProgressData(progress || { progress: 0 });
        }

        // Fetch related experiences
        if (data.relatedExperienceIds && data.relatedExperienceIds.length > 0) {
          const related = await Promise.all(
            data.relatedExperienceIds.map((id) => getExperienceById(id)),
          );
          setRelatedExperiences(related.filter(Boolean));
        }
      } catch (err) {
        console.error("Failed to load experience:", err);
        setError(`Failed to load experience: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId, currentUser]);

  // Handle navigation to related experiences
  const navigateToExperience = (id) => {
    navigate(`/learn/${id}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading educational experience...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <ErrorAlert
          title="Failed to load experience"
          message={error}
          action={() => window.location.reload()}
          actionText="Try Again"
        />
      </div>
    );
  }

  // Render authentication required state
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8 bg-blue-50 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Authentication Required</h2>
        <p className="mb-4 text-blue-600">
          Please sign in to access this educational experience and track your progress.
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/signin", { state: { returnTo: `/learn/${experienceId}` } })}
        >
          Sign In
        </button>
      </div>
    );
  }

  // Render 404 state
  if (!experience) {
    return (
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <ErrorAlert
          title="Experience Not Found"
          message="The educational experience you are looking for does not exist or has been removed."
          action={() => navigate("/learn")}
          actionText="Browse All Experiences"
        />
      </div>
    );
  }

  return (
    <div className="learning-module" ref={moduleRef}>
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center text-sm text-gray-500">
        <button onClick={() => navigate("/learn")} className="hover:text-blue-600 transition">
          Learning Dashboard
        </button>
        <span className="mx-2">›</span>
        <span className="font-medium text-gray-900">{experience.title}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* Experience Player */}
        <div className="mb-12">
          <UnityExperienceDemo
            experienceId={experienceId}
            lessonId={experience.defaultLessonId}
            title={experience.title}
            description={experience.description}
            buildUrl={experience.buildUrl}
            height="700px"
          />
        </div>

        {/* Experience Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">About this Experience</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{experience.longDescription}</p>

                {experience.learningObjectives && (
                  <>
                    <h3 className="text-lg font-medium mt-6 mb-3">Learning Objectives</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {experience.learningObjectives.map((objective, index) => (
                        <li key={index} className="text-gray-700">
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {experience.prerequisites && (
                  <>
                    <h3 className="text-lg font-medium mt-6 mb-3">Prerequisites</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {experience.prerequisites.map((prerequisite, index) => (
                        <li key={index} className="text-gray-700">
                          {prerequisite}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Instructor Notes */}
            {experience.instructorNotes && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Instructor Notes</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{experience.instructorNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Your Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
              {progressData && (
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">Overall Completion</span>
                    <span className="font-medium">{Math.round(progressData.progress * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full mb-4">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${progressData.progress * 100}%` }}
                    ></div>
                  </div>

                  {progressData.lastUpdated && (
                    <p className="text-sm text-gray-500 mb-4">
                      Last activity: {new Date(progressData.lastUpdated).toLocaleDateString()}
                    </p>
                  )}

                  {progressData.completed ? (
                    <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span>You&apos;ve completed this experience!</span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Continue your progress by completing activities in the experience.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Related Experiences */}
            {relatedExperiences.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Related Experiences</h2>
                <ul className="space-y-4">
                  {relatedExperiences.map((related) => (
                    <li key={related.id}>
                      <button
                        onClick={() => navigateToExperience(related.id)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded transition flex items-center"
                      >
                        {related.thumbnailUrl && (
                          <img
                            src={related.thumbnailUrl}
                            alt={related.title}
                            className="w-16 h-16 object-cover rounded mr-3"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{related.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{related.shortDescription}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;
