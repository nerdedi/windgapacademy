import { format } from "date-fns";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import { useAuth } from "../contexts/AuthContext";
import "./ProgressTracker.css";
import ErrorAlert from "./ui/ErrorAlert";
import LoadingSpinner from "./ui/LoadingSpinner";

/**
 * ProgressTracker component that displays the user&apos;s progress across all Unity educational experiences
 *
 * Features:
 * - Shows overall progress across all experiences
 * - Displays detailed progress for individual experiences
 * - Filters and sorts experiences by different criteria
 * - Visualizes progress with charts and progress bars
 * - Shows achievements and completed milestones
 */
const ProgressTracker = () => {
  // Get current authenticated user
  const { currentUser } = useAuth();

  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("lastUpdated");
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [stats, setStats] = useState({
    totalExperiences: 0,
    completedExperiences: 0,
    averageProgress: 0,
    totalTimeSpent: 0,
  });

  // Fetch user progress data
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Query progress collection for all documents matching the user
        const progressQuery = query(
          collection(firestore, "user_progress"),
          where("userId", "==", currentUser.uid),
          orderBy("lastUpdated", "desc"),
        );

        const progressDocs = await getDocs(progressQuery);

        if (progressDocs.empty) {
          setUserProgress([]);
          setLoading(false);
          return;
        }

        // Transform the progress documents into a more usable format
        const progressData = progressDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to Date object if needed
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date(),
          completedAt: doc.data().completedAt?.toDate() || null,
        }));

        setUserProgress(progressData);

        // Fetch corresponding experience data
        const experienceIds = [...new Set(progressData.map((item) => item.experienceId))];
        await fetchExperienceData(experienceIds);

        // Calculate stats
        calculateStats(progressData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user progress:", err);
        setError("Failed to load your progress data. Please try again.");
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [currentUser]);

  // Fetch experience data for the progress items
  const fetchExperienceData = async (experienceIds) => {
    try {
      const experienceData = [];

      for (const id of experienceIds) {
        // Query for each experience by ID
        const expQuery = query(collection(firestore, "unity_experiences"), where("id", "==", id));

        const expDocs = await getDocs(expQuery);

        if (!expDocs.empty) {
          const exp = expDocs.docs[0].data();
          experienceData.push({
            id: expDocs.docs[0].id,
            ...exp,
          });
        }
      }

      setExperiences(experienceData);
    } catch (err) {
      console.error("Error fetching experience data:", err);
    }
  };

  // Calculate overall progress statistics
  const calculateStats = (progressData) => {
    const completedExperiences = progressData.filter(
      (item) => item.progress === 1 || item.completed === true,
    ).length;
    const totalExperiences = progressData.length;
    const averageProgress =
      progressData.reduce((sum, item) => sum + (item.progress || 0), 0) / (totalExperiences || 1);
    const totalTimeSpent = progressData.reduce((sum, item) => sum + (item.timeSpent || 0), 0);

    setStats({
      totalExperiences,
      completedExperiences,
      averageProgress,
      totalTimeSpent,
    });
  };

  // Filter progress data based on selected filter
  const filteredProgress = () => {
    switch (filterType) {
      case "completed":
        return userProgress.filter((item) => item.progress === 1 || item.completed === true);
      case "inProgress":
        return userProgress.filter(
          (item) => item.progress > 0 && item.progress < 1 && !item.completed,
        );
      case "notStarted":
        return userProgress.filter((item) => item.progress === 0 && !item.completed);
      default:
        return userProgress;
    }
  };

  // Sort progress data based on selected order
  const sortedProgress = () => {
    const filtered = filteredProgress();

    switch (sortOrder) {
      case "title":
        return filtered.sort((a, b) => {
          const expA = experiences.find((e) => e.id === a.experienceId)?.title || "";
          const expB = experiences.find((e) => e.id === b.experienceId)?.title || "";
          return expA.localeCompare(expB);
        });
      case "progress":
        return filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
      case "lastUpdated":
      default:
        return filtered.sort((a, b) => b.lastUpdated - a.lastUpdated);
    }
  };

  // Format time spent in minutes to a readable format
  const formatTimeSpent = (timeInMinutes) => {
    if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // Handle experience selection for detailed view
  const handleExperienceSelect = (progress) => {
    setSelectedExperience(progress);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "N/A";
    return format(date, "MMM d, yyyy h:mm a");
  };

  // Get experience title by ID
  const getExperienceTitle = (experienceId) => {
    const experience = experiences.find((exp) => exp.id === experienceId);
    return experience?.title || "Unknown Experience";
  };

  // Render loading state
  if (loading) {
    return (
      <div className="progress-loading">
        <LoadingSpinner />
        <p>Loading your progress data...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="progress-error">
        <ErrorAlert message={error} />
        <p>Please try refreshing the page or contact support.</p>
      </div>
    );
  }

  // Render empty state if no progress data
  if (userProgress.length === 0) {
    return (
      <div className="progress-empty">
        <h2>No Progress Data</h2>
        <p>You haven&apos;t started any educational experiences yet.</p>
        <p>Explore our available experiences and start your learning journey!</p>
      </div>
    );
  }

  return (
    <div className="progress-tracker">
      {/* Header with overall stats */}
      <div className="progress-header">
        <h2>Your Learning Progress</h2>
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-label">Experiences Completed</span>
            <span className="stat-value">
              {stats.completedExperiences}/{stats.totalExperiences}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average Progress</span>
            <span className="stat-value">{Math.round(stats.averageProgress * 100)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Time Spent</span>
            <span className="stat-value">{formatTimeSpent(stats.totalTimeSpent)}</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="overall-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${stats.averageProgress * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Filters and sorting controls */}
      <div className="progress-controls">
        <div className="filters">
          <label>Filter by: </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Experiences</option>
            <option value="completed">Completed</option>
            <option value="inProgress">In Progress</option>
            <option value="notStarted">Not Started</option>
          </select>
        </div>

        <div className="sorting">
          <label>Sort by: </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option value="lastUpdated">Most Recent</option>
            <option value="title">Title</option>
            <option value="progress">Highest Progress</option>
          </select>
        </div>
      </div>

      {/* Display either the list of experiences or detailed view */}
      {!selectedExperience ? (
        <div className="progress-list">
          {sortedProgress().map((progress) => (
            <div
              key={progress.id}
              className="progress-item"
              onClick={() => handleExperienceSelect(progress)}
            >
              <div className="progress-item-header">
                <h3>{getExperienceTitle(progress.experienceId)}</h3>
                <span className="progress-badge">
                  {progress.progress === 1 || progress.completed
                    ? "Completed"
                    : progress.progress > 0
                      ? "In Progress"
                      : "Not Started"}
                </span>
              </div>

              <div className="progress-item-details">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(progress.progress || 0) * 100}%` }}
                  />
                </div>
                <span className="progress-percentage">
                  {Math.round((progress.progress || 0) * 100)}%
                </span>
              </div>

              <div className="progress-meta">
                <div>Last activity: {formatDate(progress.lastUpdated)}</div>
                {progress.timeSpent > 0 && (
                  <div>Time spent: {formatTimeSpent(progress.timeSpent)}</div>
                )}
                {progress.completedAt && (
                  <div>Completed on: {formatDate(progress.completedAt)}</div>
                )}
              </div>

              <button className="view-details-btn">View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="progress-detail">
          <button className="back-button" onClick={() => setSelectedExperience(null)}>
            &larr; Back to All Progress
          </button>

          <h2>{getExperienceTitle(selectedExperience.experienceId)}</h2>

          <div className="progress-detail-stats">
            <div className="detail-stat">
              <span className="stat-label">Progress</span>
              <span className="stat-value">
                {Math.round((selectedExperience.progress || 0) * 100)}%
              </span>
            </div>
            <div className="detail-stat">
              <span className="stat-label">Time Spent</span>
              <span className="stat-value">
                {formatTimeSpent(selectedExperience.timeSpent || 0)}
              </span>
            </div>
            <div className="detail-stat">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">{formatDate(selectedExperience.lastUpdated)}</span>
            </div>
          </div>

          <div className="detail-progress-bar">
            <div
              className="detail-progress-fill"
              style={{ width: `${(selectedExperience.progress || 0) * 100}%` }}
            />
          </div>

          <div className="stations-completed">
            <h3>Learning Stations Completed</h3>
            {selectedExperience.completedStations &&
            selectedExperience.completedStations.length > 0 ? (
              <ul className="stations-list">
                {selectedExperience.completedStations.map((stationId) => (
                  <li key={stationId} className="station-item">
                    <div className="station-name">
                      {stationId}
                      <span className="completion-badge">Completed</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No learning stations completed yet.</p>
            )}
          </div>

          <div className="experience-actions">
            <button className="continue-btn">
              {selectedExperience.progress === 1 || selectedExperience.completed
                ? "Review Experience"
                : "Continue Experience"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
