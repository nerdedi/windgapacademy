import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LibraryResources() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Resources", icon: "📚" },
    { id: "textbooks", name: "Digital Textbooks", icon: "📖" },
    { id: "videos", name: "Video Lectures", icon: "🎥" },
    { id: "simulations", name: "3D Simulations", icon: "🔬" },
    { id: "tools", name: "Learning Tools", icon: "🛠️" },
    { id: "research", name: "Research Papers", icon: "📄" },
  ];

  const resources = [
    {
      id: 1,
      title: "Advanced Physics Textbook",
      category: "textbooks",
      type: "Digital Textbook",
      description: "Comprehensive physics textbook with interactive 3D models and simulations.",
      author: "Dr. Sarah Chen",
      pages: 450,
      rating: 4.9,
      downloads: "12,847",
      image: "📖",
      tags: ["Physics", "Science", "Interactive"],
      lastUpdated: "2 weeks ago",
    },
    {
      id: 2,
      title: "Unity Game Development Series",
      category: "videos",
      type: "Video Course",
      description:
        "Complete video series covering Unity development from basics to advanced techniques.",
      author: "Alex Thompson",
      duration: "24 hours",
      rating: 4.8,
      downloads: "8,234",
      image: "🎥",
      tags: ["Unity", "Game Development", "Programming"],
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      title: "Molecular Chemistry Lab",
      category: "simulations",
      type: "3D Simulation",
      description: "Interactive molecular chemistry laboratory with realistic physics simulation.",
      author: "Dr. Michael Rodriguez",
      duration: "45 minutes",
      rating: 4.9,
      downloads: "15,692",
      image: "🧪",
      tags: ["Chemistry", "Simulation", "Laboratory"],
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      title: "Mathematical Visualization Tools",
      category: "tools",
      type: "Interactive Tool",
      description: "Advanced tools for visualizing complex mathematical concepts in 3D space.",
      author: "Prof. Lisa Green",
      features: 15,
      rating: 4.7,
      downloads: "5,923",
      image: "📐",
      tags: ["Mathematics", "Visualization", "Tools"],
      lastUpdated: "1 week ago",
    },
    {
      id: 5,
      title: "Quantum Physics Research Collection",
      category: "research",
      type: "Research Papers",
      description:
        "Curated collection of cutting-edge quantum physics research papers and studies.",
      author: "Dr. James Park",
      papers: 127,
      rating: 4.6,
      downloads: "3,456",
      image: "📄",
      tags: ["Quantum Physics", "Research", "Academic"],
      lastUpdated: "5 days ago",
    },
    {
      id: 6,
      title: "Digital Art Masterclass",
      category: "videos",
      type: "Video Tutorial",
      description: "Professional digital art and 3D modeling techniques with industry experts.",
      author: "Emma Wilson",
      duration: "18 hours",
      rating: 4.8,
      downloads: "9,871",
      image: "🎨",
      tags: ["Digital Art", "3D Modeling", "Creative"],
      lastUpdated: "4 days ago",
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getResourceMetric = (resource) => {
    if (resource.pages) return `${resource.pages} pages`;
    if (resource.duration) return resource.duration;
    if (resource.features) return `${resource.features} features`;
    if (resource.papers) return `${resource.papers} papers`;
    return "Available";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            🎓 Windgap Academy
          </button>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/courses")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => navigate("/experiences")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              3D Experiences
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Learning Library
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive collection of educational resources, tools, and materials for immersive
            learning
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:scale-105"
            >
              {/* Resource Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl relative">
                {resource.image}
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">
                  {resource.type}
                </div>
              </div>

              {/* Resource Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm font-semibold">
                    Free Access
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐</span>
                    <span className="text-sm">{resource.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{resource.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.slice(0, 2).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                      +{resource.tags.length - 2} more
                    </span>
                  )}
                </div>

                {/* Resource Info */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>👨‍🏫 {resource.author}</span>
                  <span>📊 {getResourceMetric(resource)}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>📥 {resource.downloads} downloads</span>
                  <span>🕒 {resource.lastUpdated}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/resource/${resource.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    Access Resource
                  </button>

                  <button
                    onClick={() => navigate(`/resource/${resource.id}/preview`)}
                    className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No resources found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Featured Collections */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🔬</div>
              <h3 className="text-xl font-bold mb-2">Science Lab Collection</h3>
              <p className="text-gray-400 mb-4">Interactive simulations and experiments</p>
              <button
                onClick={() => setSelectedCategory("simulations")}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Explore Collection →
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2">Unity Development Hub</h3>
              <p className="text-gray-400 mb-4">Complete game development resources</p>
              <button
                onClick={() => setSearchTerm("Unity")}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Explore Collection →
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-900/20 to-green-600/20 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-2">Academic Research</h3>
              <p className="text-gray-400 mb-4">Cutting-edge research and papers</p>
              <button
                onClick={() => setSelectedCategory("research")}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                Explore Collection →
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Expand Your Learning</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Access thousands of educational resources and tools to enhance your learning journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/courses")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate("/experiences")}
              className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Try 3D Experiences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LibraryResources;
