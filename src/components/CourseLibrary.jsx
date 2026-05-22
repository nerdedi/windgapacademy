import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllCurriculum,
  getCurriculumByCategory,
  getCurriculumStats,
  getLearningDomains,
  searchCurriculum,
} from "../services/curriculumService";
import SubjectTabs from "./SubjectTabs";

export function CourseLibrary() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const stats = getCurriculumStats();
  const domains = getLearningDomains();

  const filteredCurriculum = searchQuery
    ? searchCurriculum(searchQuery)
    : selectedCategory === "all"
      ? getAllCurriculum()
      : getCurriculumByCategory(selectedCategory);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-[#0B6E8F]">📚 LLND Learning Hub</h1>
      <p className="text-gray-600 mb-6">
        Language, Literacy, Numeracy & Digital skills curriculum aligned with ACSF and NDIS outcomes
      </p>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-teal-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-pink-600">{stats.lifeSkills}</div>
          <div className="text-sm text-gray-600">Life Skills</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.employmentSkills}</div>
          <div className="text-sm text-gray-600">Employment Skills</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.acsfAreas.length}</div>
          <div className="text-sm text-gray-600">ACSF Areas</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "overview" ? "border-b-2 border-[#0B6E8F] text-[#0B6E8F]" : "text-gray-500"}`}
        >
          📖 Overview
        </button>
        <button
          onClick={() => setActiveTab("llnd")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "llnd" ? "border-b-2 border-[#0B6E8F] text-[#0B6E8F]" : "text-gray-500"}`}
        >
          🎓 LLND Modules
        </button>
        <button
          onClick={() => setActiveTab("curriculum")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "curriculum" ? "border-b-2 border-[#0B6E8F] text-[#0B6E8F]" : "text-gray-500"}`}
        >
          📋 Full Curriculum
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Learning Domains</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {domains.map((domain) => (
              <Link
                key={domain.id}
                to={`/lessons?domain=${domain.id}`}
                className="p-4 bg-white border-2 border-gray-100 rounded-xl hover:shadow-lg hover:border-[#5ED1D2] transition-all"
              >
                <div className="text-3xl mb-2">{domain.icon}</div>
                <h3 className="font-semibold">{domain.label}</h3>
              </Link>
            ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/lessons"
              className="px-4 py-2 bg-[#0B6E8F] text-white rounded-lg hover:bg-[#095a74]"
            >
              Start Learning →
            </Link>
            <Link
              to="/games"
              className="px-4 py-2 bg-[#5ED1D2] text-white rounded-lg hover:bg-[#4cb8b9]"
            >
              Play Games 🎮
            </Link>
            <Link
              to="/supermarket"
              className="px-4 py-2 bg-[#A32C2B] text-white rounded-lg hover:bg-[#8a2424]"
            >
              Try Simulations 🛒
            </Link>
          </div>
        </div>
      )}

      {/* LLND Modules Tab */}
      {activeTab === "llnd" && <SubjectTabs />}

      {/* Full Curriculum Tab */}
      {activeTab === "curriculum" && (
        <div>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5ED1D2] focus:outline-none"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#5ED1D2] focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="life-skills">Life Skills</option>
              <option value="employment-skills">Employment Skills</option>
            </select>
          </div>

          {/* Curriculum Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCurriculum.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-white border rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{course.icon}</span>
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        course.category === "life-skills"
                          ? "bg-pink-100 text-pink-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {course.category === "life-skills" ? "Life Skills" : "Employment"}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 font-medium mb-1">Outcomes:</p>
                  <ul className="text-sm text-gray-500 list-disc list-inside">
                    {course.outcomes.slice(0, 2).map((outcome, i) => (
                      <li key={i}>{outcome}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {course.acsf.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {course.ndis.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full"
                    >
                      NDIS: {tag}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/courses/${course.id}`}
                  className="block w-full text-center px-4 py-2 bg-[#0B6E8F] text-white rounded-lg hover:bg-[#095a74] transition-colors"
                >
                  Start Course →
                </Link>
              </div>
            ))}
          </div>

          {filteredCurriculum.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>No courses found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
