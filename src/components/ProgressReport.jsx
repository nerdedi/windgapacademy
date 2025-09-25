import { format } from "date-fns";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { firestore } from "../../firebase";
import { useAuth } from "../context/AuthContext";
import "./ProgressReport.css";
import ErrorAlert from "./ui/ErrorAlert";
import LoadingSpinner from "./ui/LoadingSpinner";

/**
 * ProgressReport component for detailed reporting on a specific educational experience
 * Shows comprehensive analytics, time spent, achievements, and learning recommendations
 */
const ProgressReport = () => {
  const { experienceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Component state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);
  const [experience, setExperience] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      setError("You must be logged in to view progress reports");
      setLoading(false);
      return;
    }

    // Check if experienceId is provided
    if (!experienceId) {
      setError("No experience selected");
      setLoading(false);
      return;
    }

    // Fetch progress and experience data
    const fetchData = async () => {
      try {
        // Fetch progress data for this experience
        const progressQuery = query(
          collection(firestore, "user_progress"),
          where("userId", "==", currentUser.uid),
          where("experienceId", "==", experienceId),
        );

        const progressDocs = await getDocs(progressQuery);

        if (progressDocs.empty) {
          setError("No progress data found for this experience");
          setLoading(false);
          return;
        }

        // Get the most recent progress document
        const progressData = progressDocs.docs[0].data();
        setProgress({
          id: progressDocs.docs[0].id,
          ...progressData,
          lastUpdated: progressData.lastUpdated?.toDate() || new Date(),
          completedAt: progressData.completedAt?.toDate() || null,
        });

        // Fetch experience details
        const experienceRef = doc(firestore, "unity_experiences", experienceId);
        const experienceDoc = await getDoc(experienceRef);

        if (!experienceDoc.exists()) {
          setError("Experience not found");
          setLoading(false);
          return;
        }

        setExperience({
          id: experienceDoc.id,
          ...experienceDoc.data(),
        });

        // Fetch activity data (if available)
        await fetchActivityData();

        // Fetch achievements (if available)
        await fetchAchievements();

        setLoading(false);
      } catch (err) {
        console.error("Error fetching progress report data:", err);
        setError("Failed to load progress report. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, experienceId]);

  // Fetch user activity data for the experience
  const fetchActivityData = async () => {
    try {
      // Query activity logs collection
      const activityQuery = query(
        collection(firestore, "activity_logs"),
        where("userId", "==", currentUser.uid),
        where("experienceId", "==", experienceId),
      );

      const activityDocs = await getDocs(activityQuery);

      if (!activityDocs.empty) {
        const activities = activityDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));

        setActivityData(activities);
      }
    } catch (err) {
      console.error("Error fetching activity data:", err);
    }
  };

  // Fetch user achievements for the experience
  const fetchAchievements = async () => {
    try {
      // Query achievements collection
      const achievementsQuery = query(
        collection(firestore, "achievements"),
        where("userId", "==", currentUser.uid),
        where("experienceId", "==", experienceId),
      );

      const achievementDocs = await getDocs(achievementsQuery);

      if (!achievementDocs.empty) {
        const achievementData = achievementDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          earnedAt: doc.data().earnedAt?.toDate() || new Date(),
        }));

        setAchievements(achievementData);
      }
    } catch (err) {
      console.error("Error fetching achievements:", err);
    }
  };

  // Format time spent from minutes to readable format
  const formatTimeSpent = (minutes) => {
    if (!minutes) return "0 min";

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Not available";
    return format(date, "MMM d, yyyy h:mm a");
  };

  // Get learning stations completed percentage
  const getStationsCompletedPercentage = () => {
    if (!progress || !experience || !experience.stations) return 0;

    const totalStations = experience.stations.length;
    const completedStations = progress.completedStations?.length || 0;

    return totalStations > 0 ? (completedStations / totalStations) * 100 : 0;
  };

  // Navigate back to progress tracker
  const handleBack = () => {
    navigate("/progress");
  };

  // Navigate to resume the experience
  const handleResumeExperience = () => {
    navigate(`/experience/${experienceId}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="progress-report-loading">
        <LoadingSpinner />
        <p>Loading progress report...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="progress-report-error">
        <ErrorAlert message={error} />
        <button className="back-btn" onClick={handleBack}>
          Back to Progress Tracker
        </button>
      </div>
    );
  }

  return (
    <div className="progress-report">
      <div className="progress-report-header">
        <button className="back-btn" onClick={handleBack}>
          &larr; Back to Progress Tracker
        </button>
        <h1>Progress Report</h1>
      </div>

      <div className="progress-report-content">
        <div className="report-section experience-summary">
          <h2>{experience.title}</h2>
          <p className="experience-description">{experience.description}</p>

          <div className="experience-stats">
            <div className="stat-box">
              <div className="stat-value">{Math.round(progress.progress * 100)}%</div>
              <div className="stat-label">Overall Progress</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{formatTimeSpent(progress.timeSpent || 0)}</div>
              <div className="stat-label">Time Spent</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">
                {progress.completedStations?.length || 0}/{experience.stations?.length || 0}
              </div>
              <div className="stat-label">Stations Completed</div>
            </div>

            <div className="stat-box">
              <div className="stat-value">{achievements.length}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>

          <div className="progress-timeline">
            <div className="timeline-item">
              <div className="timeline-dot started"></div>
              <div className="timeline-content">
                <div className="timeline-title">Started</div>
                <div className="timeline-date">
                  {formatDate(progress.startedAt || progress.lastUpdated)}
                </div>
              </div>
            </div>

            <div className="timeline-line"></div>

            <div className="timeline-item">
              <div
                className={`timeline-dot ${progress.progress === 1 ? "completed" : "in-progress"}`}
              ></div>
              <div className="timeline-content">
                <div className="timeline-title">
                  {progress.progress === 1 ? "Completed" : "In Progress"}
                </div>
                <div className="timeline-date">
                  {progress.progress === 1
                    ? formatDate(progress.completedAt)
                    : `Last activity: ${formatDate(progress.lastUpdated)}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="report-section learning-stations">
          <h2>Learning Stations</h2>

          <div className="stations-progress-bar">
            <div className="stations-progress-text">
              {progress.completedStations?.length || 0} of {experience.stations?.length || 0}{" "}
              stations completed ({Math.round(getStationsCompletedPercentage())}%)
            </div>
            <div className="stations-progress">
              <div
                className="stations-progress-fill"
                style={{ width: `${getStationsCompletedPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="stations-list">
            {experience.stations &&
              experience.stations.map((station) => {
                const isCompleted =
                  progress.completedStations && progress.completedStations.includes(station.id);

                return (
                  <div
                    key={station.id}
                    className={`station-item ${isCompleted ? "completed" : ""}`}
                  >
                    <div className="station-icon">
                      {isCompleted ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"
                            fill="#10b981"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path
                            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
                            fill="#d1d5db"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="station-details">
                      <div className="station-name">{station.name}</div>
                      <div className="station-description">{station.description}</div>
                    </div>

                    <div className="station-status">
                      {isCompleted ? "Completed" : "Not completed"}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="report-section achievements">
            <h2>Achievements</h2>
            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="achievement-card">
                  <div className="achievement-icon">
                    {achievement.icon ? (
                      <img src={achievement.icon} alt={achievement.title} />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="48"
                        height="48"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path
                          d="M13 16.938V19h5v2H6v-2h5v-2.062A8.001 8.001 0 0 1 4 9V3h16v6a8.001 8.001 0 0 1-7 7.938zM1 5h2v4H1V5zm20 0h2v4h-2V5z"
                          fill="#fbbf24"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="achievement-details">
                    <h3>{achievement.title}</h3>
                    <p>{achievement.description}</p>
                    <div className="achievement-date">
                      Earned on {formatDate(achievement.earnedAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activityData.length > 0 && (
          <div className="report-section activity-history">
            <h2>Activity History</h2>
            <div className="activity-timeline">
              {activityData.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-time">{formatDate(activity.timestamp)}</div>
                  <div className="activity-details">
                    <div className="activity-type">{activity.type}</div>
                    <div className="activity-description">{activity.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="report-section recommendations">
          <h2>Recommendations</h2>
          {progress.progress === 1 ? (
            <div className="recommendation-card">
              <h3>Congratulations on completing this experience!</h3>
              <p>Based on your progress, here are some next steps you might want to consider:</p>
              <ul className="recommendation-list">
                <li>Review the content to reinforce your learning</li>
                <li>Explore advanced topics in the same subject area</li>
                <li>Check out related experiences</li>
              </ul>
            </div>
          ) : (
            <div className="recommendation-card">
              <h3>Continue your learning journey</h3>
              <p>
                You're making great progress! Here are some recommendations to help you complete
                this experience:
              </p>
              <ul className="recommendation-list">
                <li>Complete the remaining learning stations</li>
                <li>Focus on interactive elements to reinforce concepts</li>
                <li>Set aside regular time to continue your progress</li>
              </ul>
              <button className="resume-btn" onClick={handleResumeExperience}>
                Resume Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;
