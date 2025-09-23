// Portions of this file were generated with the assistance of GitHub Copilot

import * as d3 from "d3";
import React, { useState, useEffect, useRef, useMemo } from "react";

import { useStore } from "../stores";

import analyticsService from "./AnalyticsService";

/**
 * AnalyticsVisualizer - Component for rendering analytics data visualizations
 *
 * This component provides interactive data visualizations for learning analytics,
 * including engagement over time, topic strength, and recommendations.
 */
const AnalyticsVisualizer = ({ userId, timeRange = "month", className = "" }) => {
  const [insights, setInsights] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [chartType, setChartType] = useState("radar");

  // Get user data from the store
  const userData = useStore((state) => state.userData);

  // Refs for chart containers
  const radarChartRef = useRef(null);
  const timelineChartRef = useRef(null);
  const topicsChartRef = useRef(null);
  const progressChartRef = useRef(null);

  // Effect to load analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);

      try {
        // Get insights and recommendations
        const insightsData = analyticsService.getInsights();
        const recommendationsData = analyticsService.getRecommendations();

        setInsights(insightsData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [userId, timeRange]);

  // Effect to render charts when data is available
  useEffect(() => {
    if (!insights || isLoading) return;

    // Render charts based on available data
    renderRadarChart();
    renderTimelineChart();
    renderTopicsChart();
    renderProgressChart();
  }, [insights, activeTab, chartType, isLoading]);

  // Memoized data transformations
  const topicData = useMemo(() => {
    if (!insights) return [];

    return Object.entries(insights.timeByTopic || {}).map(([topic, time]) => ({
      topic,
      time,
      strength: insights.strengths.find((s) => s === topic)
        ? "high"
        : insights.weaknesses.find((w) => w === topic)
          ? "low"
          : "medium",
    }));
  }, [insights]);

  /**
   * Render radar chart for topic strengths
   */
  const renderRadarChart = () => {
    if (!radarChartRef.current || !insights || !topicData.length) return;

    // Clear previous chart
    d3.select(radarChartRef.current).selectAll("*").remove();

    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    // Create SVG
    const svg = d3
      .select(radarChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr(
        "transform",
        `translate(${(width + margin.left + margin.right) / 2},${(height + margin.top + margin.bottom) / 2})`,
      );

    // Prepare data (limited to top 8 topics)
    const data = topicData.slice(0, 8);
    const topics = data.map((d) => d.topic);

    // Normalize topic strengths for radar chart
    const maxTime = Math.max(...data.map((d) => d.time));
    const normalizedData = data.map((d) => ({
      ...d,
      normalizedValue: d.time / maxTime,
    }));

    // Create scale
    const angleScale = d3
      .scalePoint()
      .domain(topics)
      .range([0, Math.PI * 2]);

    // Create radar axes
    svg
      .selectAll(".radar-axis")
      .data(topics)
      .enter()
      .append("line")
      .attr("class", "radar-axis")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => radius * Math.sin(angleScale(d)))
      .attr("y2", (d) => -radius * Math.cos(angleScale(d)))
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "5,5");

    // Add axis labels
    svg
      .selectAll(".radar-label")
      .data(topics)
      .enter()
      .append("text")
      .attr("class", "radar-label")
      .attr("x", (d) => (radius + 20) * Math.sin(angleScale(d)))
      .attr("y", (d) => -(radius + 20) * Math.cos(angleScale(d)))
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => d)
      .attr("font-size", "12px")
      .attr("fill", "#333");

    // Create radar path
    const radarLine = d3
      .lineRadial()
      .angle((d) => angleScale(d.topic))
      .radius((d) => d.normalizedValue * radius)
      .curve(d3.curveLinearClosed);

    // Add radar area
    svg
      .append("path")
      .datum(normalizedData)
      .attr("class", "radar-area")
      .attr("d", radarLine)
      .attr("fill", "rgba(75, 192, 192, 0.2)")
      .attr("stroke", "rgba(75, 192, 192, 1)")
      .attr("stroke-width", 2);

    // Add data points
    svg
      .selectAll(".radar-point")
      .data(normalizedData)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("cx", (d) => radius * d.normalizedValue * Math.sin(angleScale(d.topic)))
      .attr("cy", (d) => -radius * d.normalizedValue * Math.cos(angleScale(d.topic)))
      .attr("r", 5)
      .attr("fill", (d) =>
        d.strength === "high" ? "#4CAF50" : d.strength === "low" ? "#F44336" : "#FFC107",
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add radar circles for reference
    const circles = [0.25, 0.5, 0.75, 1];
    svg
      .selectAll(".radar-circle")
      .data(circles)
      .enter()
      .append("circle")
      .attr("class", "radar-circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", (d) => radius * d)
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", "2,2");
  };

  /**
   * Render timeline chart for engagement over time
   */
  const renderTimelineChart = () => {
    if (!timelineChartRef.current || !insights) return;

    // This would use the events data to chart engagement over time
    // Simulated data for demonstration
    const mockTimelineData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: Math.random() * insights.engagementScore * (1 + Math.sin(i / 5) * 0.3),
    }));

    // Clear previous chart
    d3.select(timelineChartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(timelineChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3
      .scaleTime()
      .domain(d3.extent(mockTimelineData, (d) => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(mockTimelineData, (d) => d.value) * 1.1])
      .range([height, 0]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.timeFormat("%d %b")));

    svg.append("g").call(d3.axisLeft(y));

    // Add line
    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(mockTimelineData)
      .attr("fill", "none")
      .attr("stroke", "#4285F4")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add area
    const area = d3
      .area()
      .x((d) => x(d.date))
      .y0(height)
      .y1((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(mockTimelineData)
      .attr("fill", "rgba(66, 133, 244, 0.2)")
      .attr("d", area);

    // Add dots
    svg
      .selectAll(".dot")
      .data(mockTimelineData.filter((_, i) => i % 5 === 0)) // Show every 5th dot for clarity
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", "#4285F4")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);
  };

  /**
   * Render topics chart for time spent on each topic
   */
  const renderTopicsChart = () => {
    if (!topicsChartRef.current || !insights || !topicData.length) return;

    // Clear previous chart
    d3.select(topicsChartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 50, left: 150 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Sort data by time spent
    const sortedData = [...topicData].sort((a, b) => b.time - a.time).slice(0, 10);

    // Create SVG
    const svg = d3
      .select(topicsChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const y = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.topic))
      .range([0, height])
      .padding(0.1);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.time)])
      .range([0, width]);

    // Add axes
    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickFormat((d) => `${Math.round(d / (60 * 1000))} min`),
      );

    // Add bars
    svg
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.topic))
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", (d) => x(d.time))
      .attr("fill", (d) =>
        d.strength === "high" ? "#4CAF50" : d.strength === "low" ? "#F44336" : "#FFC107",
      );

    // Add labels
    svg
      .selectAll(".time-label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "time-label")
      .attr("y", (d) => y(d.topic) + y.bandwidth() / 2)
      .attr("x", (d) => x(d.time) + 5)
      .attr("dy", "0.35em")
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text((d) => `${Math.round(d.time / (60 * 1000))} min`);
  };

  /**
   * Render progress chart for learning path progress
   */
  const renderProgressChart = () => {
    if (!progressChartRef.current || !recommendations || !recommendations.recommendedLearningPath)
      return;

    // Clear previous chart
    d3.select(progressChartRef.current).selectAll("*").remove();

    const margin = { top: 30, right: 20, bottom: 30, left: 20 };
    const width = 500 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    const path = recommendations.recommendedLearningPath;

    // Create SVG
    const svg = d3
      .select(progressChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate positions
    const nodeWidth = 120;
    const nodeHeight = 60;
    const nodeMargin = 40;
    const totalWidth = path.length * (nodeWidth + nodeMargin) - nodeMargin;

    // Create nodes
    const nodeGroup = svg
      .selectAll(".node")
      .data(path)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d, i) => {
        const x = i * (nodeWidth + nodeMargin);
        const y = 0;
        return `translate(${x},${y})`;
      });

    // Add node rectangles
    nodeGroup
      .append("rect")
      .attr("width", nodeWidth)
      .attr("height", nodeHeight)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", "#E1F5FE")
      .attr("stroke", "#0288D1")
      .attr("stroke-width", 2);

    // Add topic text
    nodeGroup
      .append("text")
      .attr("x", nodeWidth / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#0288D1")
      .text((d) => d.topic);

    // Add content type text
    nodeGroup
      .append("text")
      .attr("x", nodeWidth / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#555")
      .text((d) => d.contentType);

    // Add connecting lines
    for (let i = 0; i < path.length - 1; i++) {
      svg
        .append("line")
        .attr("x1", (i + 1) * nodeWidth + i * nodeMargin)
        .attr("y1", nodeHeight / 2)
        .attr("x2", (i + 1) * (nodeWidth + nodeMargin))
        .attr("y2", nodeHeight / 2)
        .attr("stroke", "#0288D1")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5");
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`analytics-visualizer ${className}`}>
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Render no data state
  if (!insights) {
    return (
      <div className={`analytics-visualizer ${className}`}>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700">No Analytics Data Available</h3>
          <p className="text-gray-500 mt-2">Start learning to generate analytics insights.</p>
        </div>
      </div>
    );
  }

  // Main component render
  return (
    <div className={`analytics-visualizer ${className}`}>
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "topics" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("topics")}
        >
          Topics
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === "recommendations" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("recommendations")}
        >
          Recommendations
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="overview-tab">
          {/* Engagement score */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Engagement Score</h3>
            <div className="flex items-center">
              <div className="w-64 h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  style={{ width: `${Math.min(100, insights.engagementScore * 10)}%` }}
                ></div>
              </div>
              <span className="ml-3 font-bold text-lg">
                {Math.round(insights.engagementScore * 10)}/10
              </span>
            </div>
          </div>

          {/* Engagement timeline */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Engagement Over Time</h3>
            <div ref={timelineChartRef} className="w-full h-52"></div>
          </div>

          {/* Learning style */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Your Learning Style</h3>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-blue-800">
                    {recommendations?.learningPace === "fast"
                      ? "Fast-Paced Visual Learner"
                      : recommendations?.learningPace === "slow"
                        ? "Methodical Deep Learner"
                        : "Balanced Interactive Learner"}
                  </h4>
                  <p className="text-sm text-blue-600">
                    {recommendations?.learningPace === "fast"
                      ? "You learn quickly through visual content and prefer shorter, focused sessions."
                      : recommendations?.learningPace === "slow"
                        ? "You take time to deeply understand concepts and prefer thorough explanations."
                        : "You have a balanced approach to learning with a preference for interactive content."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Total Learning Time</div>
              <div className="text-2xl font-bold">
                {Math.round(insights.totalTimeSpent / (60 * 1000))} min
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Topics Explored</div>
              <div className="text-2xl font-bold">
                {Object.keys(insights.timeByTopic || {}).length}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">Last Active</div>
              <div className="text-2xl font-bold">
                {insights.lastActive ? new Date(insights.lastActive).toLocaleDateString() : "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === "topics" && (
        <div className="topics-tab">
          {/* Chart type switcher */}
          <div className="flex mb-4">
            <button
              className={`px-3 py-1 rounded-md mr-2 ${chartType === "radar" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setChartType("radar")}
            >
              Radar Chart
            </button>
            <button
              className={`px-3 py-1 rounded-md ${chartType === "bar" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setChartType("bar")}
            >
              Bar Chart
            </button>
          </div>

          {/* Topic strength visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Topic Strength Map</h3>
            {chartType === "radar" ? (
              <div ref={radarChartRef} className="w-full flex justify-center"></div>
            ) : (
              <div ref={topicsChartRef} className="w-full"></div>
            )}
          </div>

          {/* Strengths and weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-green-700">Your Strengths</h3>
              <ul className="space-y-2">
                {insights.strengths.map((topic, idx) => (
                  <li
                    key={`strength-${idx}`}
                    className="flex items-center p-2 bg-green-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {topic}
                  </li>
                ))}
                {insights.strengths.length === 0 && (
                  <li className="text-gray-500 italic">No strengths identified yet</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-700">Areas for Improvement</h3>
              <ul className="space-y-2">
                {insights.weaknesses.map((topic, idx) => (
                  <li
                    key={`weakness-${idx}`}
                    className="flex items-center p-2 bg-red-50 rounded-md"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-600 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {topic}
                  </li>
                ))}
                {insights.weaknesses.length === 0 && (
                  <li className="text-gray-500 italic">No improvement areas identified yet</li>
                )}
              </ul>
            </div>
          </div>

          {/* Content preferences */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Content Type Preferences</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(insights.preferredContentTypes || {}).map(([type, count], idx) => (
                <div
                  key={`content-${idx}`}
                  className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                >
                  {type} <span className="font-bold ml-1">{count}</span>
                </div>
              ))}
              {Object.keys(insights.preferredContentTypes || {}).length === 0 && (
                <div className="text-gray-500 italic">No content preferences identified yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === "recommendations" && (
        <div className="recommendations-tab">
          {/* Learning path visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Recommended Learning Path</h3>
            <div ref={progressChartRef} className="w-full overflow-x-auto"></div>
          </div>

          {/* Optimization suggestions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Optimization Suggestions</h3>
            <div className="space-y-4">
              {recommendations?.recommendedTimePerSession && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Recommended Session Duration</h4>
                  <p className="text-blue-600">
                    Based on your learning patterns, aim for{" "}
                    {recommendations.recommendedTimePerSession} minute sessions for optimal
                    engagement and retention.
                  </p>
                </div>
              )}

              {recommendations?.needsBreak && (
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-semibold text-amber-800">Time for a Break</h4>
                  <p className="text-amber-600">
                    Your recent engagement metrics suggest you might benefit from taking a short
                    break before continuing.
                  </p>
                </div>
              )}

              {recommendations?.topicsToReinforce?.length > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800">Topics to Revisit</h4>
                  <ul className="mt-2 space-y-1">
                    {recommendations.topicsToReinforce.map((topic, idx) => (
                      <li key={`revisit-${idx}`} className="text-green-600">
                        • {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recommendations?.effectiveContentTypes?.length > 0 && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800">Most Effective Content Types</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {recommendations.effectiveContentTypes.map((type, idx) => (
                      <div
                        key={`effective-${idx}`}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsVisualizer;
