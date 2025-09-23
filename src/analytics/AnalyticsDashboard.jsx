// Portions of this file were generated with the assistance of GitHub Copilot

import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import React, { useState, useEffect } from "react";

import { firestore } from "../../firebase";

import { useAnalytics } from "./AnalyticsContext";
import AnalyticsVisualizer from "./AnalyticsVisualizer";

/**
 * AnalyticsDashboard - Admin dashboard for monitoring analytics
 *
 * This component provides administrators with a comprehensive view of
 * user analytics, platform usage patterns, and learning trends.
 */
const AnalyticsDashboard = () => {
  const { insights, recommendations, isLoading, refreshInsightsAndRecommendations } =
    useAnalytics();
  const [aggregateData, setAggregateData] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");
  const [isLoadingAggregate, setIsLoadingAggregate] = useState(true);

  // Load aggregate analytics data
  useEffect(() => {
    const loadAggregateData = async () => {
      setIsLoadingAggregate(true);

      try {
        // Determine time range
        const now = new Date();
        let startTime;

        switch (timeRange) {
          case "day":
            startTime = new Date(now.setDate(now.getDate() - 1));
            break;
          case "week":
            startTime = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            startTime = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "year":
            startTime = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
          default:
            startTime = new Date(now.setDate(now.getDate() - 7));
        }

        // Query Firestore for aggregate analytics
        const aggregateRef = collection(firestore, "aggregateAnalytics");
        const q = query(
          aggregateRef,
          where("timestamp", ">=", startTime.getTime()),
          orderBy("timestamp", "desc"),
        );

        const querySnapshot = await getDocs(q);
        const aggregateEvents = [];

        querySnapshot.forEach((doc) => {
          aggregateEvents.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Process aggregate data
        const processed = processAggregateData(aggregateEvents);
        setAggregateData(processed);

        // Load user profiles
        await loadUserProfiles();
      } catch (error) {
        console.error("Error loading aggregate analytics:", error);
      } finally {
        setIsLoadingAggregate(false);
      }
    };

    loadAggregateData();
  }, [timeRange]);

  // Load user profiles with analytics data
  const loadUserProfiles = async () => {
    try {
      const userAnalyticsRef = collection(firestore, "userAnalytics");
      const q = query(userAnalyticsRef, limit(50)); // Limit to 50 users

      const querySnapshot = await getDocs(q);
      const profiles = [];

      querySnapshot.forEach((doc) => {
        profiles.push({
          userId: doc.id,
          ...doc.data(),
        });
      });

      setUserProfiles(profiles);
    } catch (error) {
      console.error("Error loading user profiles:", error);
    }
  };

  // Process aggregate data for visualization
  const processAggregateData = (events) => {
    if (!events || events.length === 0) return null;

    // Sort events by timestamp
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);

    // Calculate daily event counts
    const dailyCounts = {};
    const eventTypeData = {};
    let totalUsers = new Set();
    let totalSessions = new Set();
    let totalEvents = 0;
    let avgEngagement = 0;

    sortedEvents.forEach((event) => {
      // Add to total counts
      totalUsers.add(event.userId);
      totalSessions.add(event.sessionId);
      totalEvents += event.totalEvents || 0;
      avgEngagement += event.avgEngagement || 0;

      // Process by date
      const date = new Date(event.timestamp).toISOString().split("T")[0];

      if (!dailyCounts[date]) {
        dailyCounts[date] = {
          date,
          users: new Set(),
          sessions: new Set(),
          events: 0,
          engagement: 0,
          engagementCount: 0,
        };
      }

      dailyCounts[date].users.add(event.userId);
      dailyCounts[date].sessions.add(event.sessionId);
      dailyCounts[date].events += event.totalEvents || 0;

      if (event.avgEngagement) {
        dailyCounts[date].engagement += event.avgEngagement;
        dailyCounts[date].engagementCount += 1;
      }

      // Process by event type
      if (event.eventCounts) {
        Object.entries(event.eventCounts).forEach(([type, count]) => {
          if (!eventTypeData[type]) {
            eventTypeData[type] = 0;
          }
          eventTypeData[type] += count;
        });
      }
    });

    // Convert daily counts to array and calculate averages
    const dailyData = Object.values(dailyCounts).map((day) => ({
      date: day.date,
      userCount: day.users.size,
      sessionCount: day.sessions.size,
      eventCount: day.events,
      avgEngagement: day.engagementCount > 0 ? day.engagement / day.engagementCount : 0,
    }));

    // Sort event types by count
    const eventTypes = Object.entries(eventTypeData)
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({ type, count }));

    return {
      dailyData,
      eventTypes,
      totals: {
        users: totalUsers.size,
        sessions: totalSessions.size,
        events: totalEvents,
        avgEngagement: events.length > 0 ? avgEngagement / events.length : 0,
      },
    };
  };

  // Render loading state
  if ((isLoading && activeTab === "personal") || (isLoadingAggregate && activeTab !== "personal")) {
    return (
      <div className="analytics-dashboard p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>

      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("overview")}
        >
          Platform Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "users" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("users")}
        >
          User Analytics
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "personal" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Insights
        </button>
      </div>

      {/* Time range selector (not for personal tab) */}
      {activeTab !== "personal" && (
        <div className="flex mb-6">
          <span className="mr-3 text-gray-600">Time Range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && aggregateData && (
        <div className="overview-tab">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-500">Total Users</div>
              <div className="text-3xl font-bold text-blue-700">{aggregateData.totals.users}</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-500">Total Sessions</div>
              <div className="text-3xl font-bold text-green-700">
                {aggregateData.totals.sessions}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-500">Total Events</div>
              <div className="text-3xl font-bold text-purple-700">
                {aggregateData.totals.events}
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="text-sm text-amber-500">Avg Engagement</div>
              <div className="text-3xl font-bold text-amber-700">
                {aggregateData.totals.avgEngagement.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Daily Activity Chart */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Daily Platform Activity</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm overflow-x-auto">
              {aggregateData.dailyData.length > 0 ? (
                <div className="min-w-[600px] h-80">
                  <DailyActivityChart data={aggregateData.dailyData} />
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">No daily data available</div>
              )}
            </div>
          </div>

          {/* Event Type Distribution */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Event Type Distribution</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              {aggregateData.eventTypes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-60">
                    <EventTypeChart data={aggregateData.eventTypes} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Most Common Events</h4>
                    <ul className="space-y-2">
                      {aggregateData.eventTypes.slice(0, 5).map((event, idx) => (
                        <li
                          key={`event-${idx}`}
                          className="flex justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-gray-800">{event.type}</span>
                          <span className="font-medium text-blue-600">{event.count}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500">No event type data available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="users-tab">
          {/* Learning Patterns */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">User Learning Patterns</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Topic Interest Distribution</h4>
                <TopicDistributionChart userProfiles={userProfiles} />
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Learning Style Distribution</h4>
                <LearningStyleChart userProfiles={userProfiles} />
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">User Analytics</h3>
            <div className="bg-white overflow-x-auto">
              {userProfiles.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Engagement Score
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Topics
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Updated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userProfiles.map((user) => (
                      <tr key={user.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.userId.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.engagementScore ? user.engagementScore.toFixed(2) : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.learningPatterns ? Object.keys(user.learningPatterns).length : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center p-4 text-gray-500">No user profiles available</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Personal Tab */}
      {activeTab === "personal" && (
        <div className="personal-tab">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Learning Analytics</h3>
            <button
              onClick={refreshInsightsAndRecommendations}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Refresh
            </button>
          </div>

          <AnalyticsVisualizer className="mt-4" />
        </div>
      )}
    </div>
  );
};

// Daily Activity Chart Component
const DailyActivityChart = ({ data }) => {
  // In a real implementation, this would use d3.js or a charting library
  // Simplified placeholder for demonstration
  return (
    <div className="flex flex-col h-full justify-end">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-500">Users</div>
          <div className="h-40 flex items-end">
            {data.map((day, i) => (
              <div
                key={`user-${i}`}
                className="w-full bg-blue-400 mx-1 rounded-t-sm"
                style={{
                  height: `${(day.userCount / Math.max(...data.map((d) => d.userCount))) * 100}%`,
                }}
                title={`${day.date}: ${day.userCount} users`}
              ></div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 overflow-hidden">
            {data.map((day, i) => (
              <div key={`date-${i}`} className="w-full text-center truncate">
                {new Date(day.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-500">Sessions</div>
          <div className="h-40 flex items-end">
            {data.map((day, i) => (
              <div
                key={`session-${i}`}
                className="w-full bg-green-400 mx-1 rounded-t-sm"
                style={{
                  height: `${(day.sessionCount / Math.max(...data.map((d) => d.sessionCount))) * 100}%`,
                }}
                title={`${day.date}: ${day.sessionCount} sessions`}
              ></div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 overflow-hidden">
            {data.map((day, i) => (
              <div key={`date-${i}`} className="w-full text-center truncate">
                {new Date(day.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="text-sm text-amber-500">Engagement</div>
          <div className="h-40 flex items-end">
            {data.map((day, i) => (
              <div
                key={`engagement-${i}`}
                className="w-full bg-amber-400 mx-1 rounded-t-sm"
                style={{
                  height: `${(day.avgEngagement / Math.max(...data.map((d) => d.avgEngagement))) * 100}%`,
                }}
                title={`${day.date}: ${day.avgEngagement.toFixed(2)} avg engagement`}
              ></div>
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-2 overflow-hidden">
            {data.map((day, i) => (
              <div key={`date-${i}`} className="w-full text-center truncate">
                {new Date(day.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Event Type Chart Component
const EventTypeChart = ({ data }) => {
  // In a real implementation, this would use d3.js or a charting library
  // Simplified placeholder for demonstration
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-amber-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-red-500",
  ];

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex h-full items-center">
      <div className="w-40 h-40 relative rounded-full overflow-hidden">
        {/* Create pie chart segments */}
        {data.map((item, idx) => {
          const percentage = (item.count / total) * 100;
          return (
            <div
              key={`pie-${idx}`}
              className={`absolute ${colors[idx % colors.length]}`}
              style={{
                width: "100%",
                height: "100%",
                // This is a very simplified pie chart - real implementation would use SVG
                // or a charting library
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(idx * 0.1)}% ${50 - 50 * Math.sin(idx * 0.1)}%)`,
              }}
              title={`${item.type}: ${percentage.toFixed(1)}%`}
            ></div>
          );
        })}
      </div>
      <div className="ml-4">
        <ul className="space-y-1">
          {data.slice(0, 5).map((item, idx) => (
            <li key={`legend-${idx}`} className="flex items-center text-sm">
              <span className={`w-3 h-3 inline-block mr-2 ${colors[idx % colors.length]}`}></span>
              {item.type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Topic Distribution Chart Component
const TopicDistributionChart = ({ userProfiles }) => {
  // Process user profiles to get topic distribution
  const topicDistribution = {};

  userProfiles.forEach((user) => {
    if (user.learningPatterns) {
      Object.keys(user.learningPatterns).forEach((topic) => {
        if (!topicDistribution[topic]) {
          topicDistribution[topic] = 0;
        }
        topicDistribution[topic]++;
      });
    }
  });

  // Sort by popularity
  const sortedTopics = Object.entries(topicDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8) // Limit to top 8
    .map(([topic, count]) => ({ topic, count }));

  // In a real implementation, this would use d3.js or a charting library
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-2">
        {sortedTopics.map((item, idx) => (
          <div key={`topic-${idx}`} className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{item.topic}</span>
              <span>{item.count} users</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(item.count / userProfiles.length) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2">
        <div className="text-sm text-gray-600 mb-2">
          <p>Most popular topics across all users</p>
        </div>

        {sortedTopics.length === 0 && (
          <div className="text-center p-4 text-gray-500">No topic data available</div>
        )}
      </div>
    </div>
  );
};

// Learning Style Chart Component
const LearningStyleChart = ({ userProfiles }) => {
  // Count learning styles
  const styleCount = {};

  userProfiles.forEach((user) => {
    if (user.learningStyle) {
      if (!styleCount[user.learningStyle]) {
        styleCount[user.learningStyle] = 0;
      }
      styleCount[user.learningStyle]++;
    }
  });

  // Convert to array
  const styles = Object.entries(styleCount).map(([style, count]) => ({ style, count }));

  // Add default styles if none found
  if (styles.length === 0) {
    ["visual", "auditory", "kinesthetic", "balanced"].forEach((style) => {
      styles.push({ style, count: 0 });
    });
  }

  const colors = {
    visual: "bg-blue-500",
    auditory: "bg-green-500",
    kinesthetic: "bg-purple-500",
    balanced: "bg-amber-500",
    social: "bg-indigo-500",
    "night-owl": "bg-pink-500",
    "early-bird": "bg-teal-500",
  };

  // In a real implementation, this would use d3.js or a charting library
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-2">
        {styles.map((item, idx) => (
          <div key={`style-${idx}`} className="flex items-center mb-3">
            <div className={`w-8 h-8 ${colors[item.style] || "bg-gray-500"} rounded-md mr-3`}></div>
            <div>
              <div className="text-sm font-medium">{item.style}</div>
              <div className="text-xs text-gray-500">{item.count} users</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-2 flex items-center justify-center">
        <div className="relative w-40 h-40">
          {styles.map((item, idx) => {
            const percentage =
              userProfiles.length > 0 ? (item.count / userProfiles.length) * 100 : 0;
            const angle = (idx / styles.length) * 360;
            return (
              <div
                key={`style-pie-${idx}`}
                className={`absolute inset-0 ${colors[item.style] || "bg-gray-500"}`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 40 * Math.cos((angle * Math.PI) / 180)}% ${50 - 40 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 40 * Math.cos(((angle + 360 / styles.length) * Math.PI) / 180)}% ${50 - 40 * Math.sin(((angle + 360 / styles.length) * Math.PI) / 180)}%)`,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
