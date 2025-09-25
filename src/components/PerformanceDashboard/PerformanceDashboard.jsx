import { useEffect, useState } from "react";

import perfMetrics from "../../utils/PerfMetrics";
import "./PerformanceDashboard.css";

/**
 * PerformanceDashboard - Displays performance metrics collected from Unity WebGL sessions
 * Helps administrators monitor performance and make optimization decisions
 */
const PerformanceDashboard = () => {
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("fps");

  // Fetch the metrics data when component mounts
  useEffect(() => {
    const fetchMetricsData = async () => {
      try {
        setLoading(true);
        // Get metrics data from our metrics utility
        const data = await perfMetrics.getAllMetrics();
        setMetricsData(data);
      } catch (err) {
        console.error("Failed to load metrics data:", err);
        setError("Could not load performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetricsData();

    // Set up polling to refresh metrics data every 30 seconds
    const intervalId = setInterval(fetchMetricsData, 30000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Calculate average FPS across all sessions
  const calculateAverageFPS = () => {
    if (!metricsData || !metricsData.fps || metricsData.fps.length === 0) {
      return 0;
    }

    const sum = metricsData.fps.reduce((acc, curr) => acc + curr.value, 0);
    return (sum / metricsData.fps.length).toFixed(2);
  };

  // Calculate average memory usage across all sessions
  const calculateAverageMemory = () => {
    if (!metricsData || !metricsData.memory || metricsData.memory.length === 0) {
      return 0;
    }

    const sum = metricsData.memory.reduce((acc, curr) => acc + curr.value, 0);
    const avgBytes = sum / metricsData.memory.length;

    // Convert bytes to MB for display
    return (avgBytes / (1024 * 1024)).toFixed(2);
  };

  // Calculate average load time
  const calculateAverageLoadTime = () => {
    if (!metricsData || !metricsData.loadTime || metricsData.loadTime.length === 0) {
      return 0;
    }

    const sum = metricsData.loadTime.reduce((acc, curr) => acc + curr.value, 0);
    return (sum / metricsData.loadTime.length).toFixed(2);
  };

  // Get metrics for a specific device type
  const getDeviceTypeMetrics = (deviceType) => {
    if (!metricsData || !metricsData.deviceTypes) {
      return { count: 0, percentage: 0 };
    }

    const count = metricsData.deviceTypes[deviceType] || 0;
    const total = Object.values(metricsData.deviceTypes).reduce((a, b) => a + b, 0);
    const percentage = total > 0 ? ((count / total) * 100).toFixed(2) : 0;

    return { count, percentage };
  };

  // Render a simple bar chart for FPS data
  const renderFPSChart = () => {
    if (!metricsData || !metricsData.fps || metricsData.fps.length === 0) {
      return <div className="empty-chart">No FPS data available</div>;
    }

    // Group FPS data into ranges for the chart
    const fpsRanges = {
      "0-15": 0,
      "16-30": 0,
      "31-45": 0,
      "46-60": 0,
      "60+": 0,
    };

    metricsData.fps.forEach((item) => {
      const fps = item.value;
      if (fps <= 15) fpsRanges["0-15"]++;
      else if (fps <= 30) fpsRanges["16-30"]++;
      else if (fps <= 45) fpsRanges["31-45"]++;
      else if (fps <= 60) fpsRanges["46-60"]++;
      else fpsRanges["60+"]++;
    });

    const maxCount = Math.max(...Object.values(fpsRanges));

    return (
      <div className="chart fps-chart">
        {Object.entries(fpsRanges).map(([range, count]) => (
          <div key={range} className="chart-bar-container">
            <div className="chart-label">{range} FPS</div>
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  backgroundColor:
                    range === "0-15"
                      ? "#ff4d4d"
                      : range === "16-30"
                        ? "#ffaa00"
                        : range === "31-45"
                          ? "#ffff00"
                          : range === "46-60"
                            ? "#00cc44"
                            : "#00aaff",
                }}
              ></div>
              <span className="chart-value">{count}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render a simple bar chart for memory usage data
  const renderMemoryChart = () => {
    if (!metricsData || !metricsData.memory || metricsData.memory.length === 0) {
      return <div className="empty-chart">No memory data available</div>;
    }

    // Group memory data into ranges (in MB) for the chart
    const memoryRanges = {
      "0-50": 0,
      "51-100": 0,
      "101-200": 0,
      "201-400": 0,
      "400+": 0,
    };

    metricsData.memory.forEach((item) => {
      const memoryMB = item.value / (1024 * 1024);
      if (memoryMB <= 50) memoryRanges["0-50"]++;
      else if (memoryMB <= 100) memoryRanges["51-100"]++;
      else if (memoryMB <= 200) memoryRanges["101-200"]++;
      else if (memoryMB <= 400) memoryRanges["201-400"]++;
      else memoryRanges["400+"]++;
    });

    const maxCount = Math.max(...Object.values(memoryRanges));

    return (
      <div className="chart memory-chart">
        {Object.entries(memoryRanges).map(([range, count]) => (
          <div key={range} className="chart-bar-container">
            <div className="chart-label">{range} MB</div>
            <div className="chart-bar-wrapper">
              <div
                className="chart-bar"
                style={{
                  width: `${(count / maxCount) * 100}%`,
                  backgroundColor:
                    range === "400+"
                      ? "#ff4d4d"
                      : range === "201-400"
                        ? "#ffaa00"
                        : range === "101-200"
                          ? "#ffff00"
                          : range === "51-100"
                            ? "#00cc44"
                            : "#00aaff",
                }}
              ></div>
              <span className="chart-value">{count}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render device type distribution chart
  const renderDeviceChart = () => {
    if (!metricsData || !metricsData.deviceTypes) {
      return <div className="empty-chart">No device data available</div>;
    }

    const deviceTypes = Object.keys(metricsData.deviceTypes);
    const maxCount = Math.max(...Object.values(metricsData.deviceTypes));

    return (
      <div className="chart device-chart">
        {deviceTypes.map((type) => {
          const count = metricsData.deviceTypes[type];
          const total = Object.values(metricsData.deviceTypes).reduce((a, b) => a + b, 0);
          const percentage = ((count / total) * 100).toFixed(2);

          return (
            <div key={type} className="chart-bar-container">
              <div className="chart-label">{type}</div>
              <div className="chart-bar-wrapper">
                <div
                  className="chart-bar"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: type.includes("mobile") ? "#ffaa00" : "#00aaff",
                  }}
                ></div>
                <span className="chart-value">
                  {count} ({percentage}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Get recommendations based on performance metrics
  const getOptimizationRecommendations = () => {
    const recommendations = [];

    if (!metricsData) return recommendations;

    const avgFPS = parseFloat(calculateAverageFPS());
    const mobileMetrics = getDeviceTypeMetrics("mobile");

    // FPS recommendations
    if (avgFPS < 30) {
      recommendations.push({
        title: "Low FPS detected",
        description:
          "Average FPS is below 30, consider optimizing graphics or reducing scene complexity",
        severity: "high",
      });
    } else if (avgFPS < 45) {
      recommendations.push({
        title: "FPS optimization recommended",
        description: "Average FPS is between 30-45, some users may experience lag",
        severity: "medium",
      });
    }

    // Mobile device recommendations
    if (mobileMetrics.percentage > 30 && avgFPS < 40) {
      recommendations.push({
        title: "Mobile performance issues",
        description: `${mobileMetrics.percentage}% of users are on mobile devices and performance is suboptimal`,
        severity: "high",
      });
    }

    // Memory usage recommendations
    const avgMemory = parseFloat(calculateAverageMemory());
    if (avgMemory > 300) {
      recommendations.push({
        title: "High memory usage",
        description: `Average memory usage is ${avgMemory}MB, consider optimizing assets and textures`,
        severity: "high",
      });
    } else if (avgMemory > 200) {
      recommendations.push({
        title: "Moderate memory usage",
        description: `Average memory usage is ${avgMemory}MB, monitor for potential issues`,
        severity: "medium",
      });
    }

    return recommendations;
  };

  return (
    <div className="performance-dashboard">
      <h2 className="dashboard-title">Unity WebGL Performance Dashboard</h2>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading performance metrics...</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {metricsData && !loading && (
        <>
          <div className="metrics-summary">
            <div className="metric-card">
              <h3>Average FPS</h3>
              <div className="metric-value">{calculateAverageFPS()}</div>
              <div
                className={`metric-indicator ${parseFloat(calculateAverageFPS()) < 30 ? "red" : parseFloat(calculateAverageFPS()) < 50 ? "yellow" : "green"}`}
              ></div>
            </div>

            <div className="metric-card">
              <h3>Memory Usage</h3>
              <div className="metric-value">{calculateAverageMemory()} MB</div>
              <div
                className={`metric-indicator ${parseFloat(calculateAverageMemory()) > 300 ? "red" : parseFloat(calculateAverageMemory()) > 200 ? "yellow" : "green"}`}
              ></div>
            </div>

            <div className="metric-card">
              <h3>Load Time</h3>
              <div className="metric-value">{calculateAverageLoadTime()} s</div>
              <div
                className={`metric-indicator ${parseFloat(calculateAverageLoadTime()) > 5 ? "red" : parseFloat(calculateAverageLoadTime()) > 3 ? "yellow" : "green"}`}
              ></div>
            </div>

            <div className="metric-card">
              <h3>Mobile Users</h3>
              <div className="metric-value">{getDeviceTypeMetrics("mobile").percentage}%</div>
              <div className="metric-secondary">
                {getDeviceTypeMetrics("mobile").count} sessions
              </div>
            </div>

            <div className="metric-card">
              <h3>Desktop Users</h3>
              <div className="metric-value">{getDeviceTypeMetrics("desktop").percentage}%</div>
              <div className="metric-secondary">
                {getDeviceTypeMetrics("desktop").count} sessions
              </div>
            </div>
          </div>

          <div className="metrics-tabs">
            <button
              className={`tab-button ${activeTab === "fps" ? "active" : ""}`}
              onClick={() => setActiveTab("fps")}
            >
              FPS Distribution
            </button>
            <button
              className={`tab-button ${activeTab === "memory" ? "active" : ""}`}
              onClick={() => setActiveTab("memory")}
            >
              Memory Usage
            </button>
            <button
              className={`tab-button ${activeTab === "devices" ? "active" : ""}`}
              onClick={() => setActiveTab("devices")}
            >
              Device Types
            </button>
            <button
              className={`tab-button ${activeTab === "recommendations" ? "active" : ""}`}
              onClick={() => setActiveTab("recommendations")}
            >
              Recommendations
            </button>
          </div>

          <div className="metrics-content">
            {activeTab === "fps" && (
              <div className="tab-content">
                <h3 className="tab-title">FPS Distribution</h3>
                {renderFPSChart()}
              </div>
            )}

            {activeTab === "memory" && (
              <div className="tab-content">
                <h3 className="tab-title">Memory Usage Distribution</h3>
                {renderMemoryChart()}
              </div>
            )}

            {activeTab === "devices" && (
              <div className="tab-content">
                <h3 className="tab-title">Device Type Distribution</h3>
                {renderDeviceChart()}
              </div>
            )}

            {activeTab === "recommendations" && (
              <div className="tab-content">
                <h3 className="tab-title">Optimization Recommendations</h3>
                <div className="recommendations-list">
                  {getOptimizationRecommendations().length > 0 ? (
                    getOptimizationRecommendations().map((rec, index) => (
                      <div key={index} className={`recommendation-item ${rec.severity}`}>
                        <h4 className="recommendation-title">{rec.title}</h4>
                        <p className="recommendation-description">{rec.description}</p>
                        <div className={`recommendation-severity ${rec.severity}`}>
                          {rec.severity.toUpperCase()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-recommendations">
                      No optimization recommendations at this time. Performance metrics are within
                      acceptable ranges.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PerformanceDashboard;
// End of file
