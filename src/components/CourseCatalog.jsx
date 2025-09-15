import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CourseCatalog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Courses", icon: "📚" },
    { id: "science", name: "Science", icon: "🔬" },
    { id: "mathematics", name: "Mathematics", icon: "📐" },
    { id: "technology", name: "Technology", icon: "💻" },
    { id: "arts", name: "Arts & Design", icon: "🎨" },
    { id: "language", name: "Languages", icon: "🌍" },
    { id: "business", name: "Business", icon: "💼" },
  ];

  const courses = [
    {
      id: 1,
      title: "Interactive Physics Laboratory",
      category: "science",
      level: "Intermediate",
      duration: "8 weeks",
      students: "2,847",
      rating: 4.9,
      description:
        "Explore physics concepts through immersive 3D simulations and virtual experiments.",
      image: "🔬",
      features: ["3D Simulations", "Virtual Lab", "Interactive Experiments", "Real-time Physics"],
      instructor: "Dr. Sarah Chen",
      price: "Free",
      progress: 0,
    },
    {
      id: 2,
      title: "Advanced Calculus in 3D Space",
      category: "mathematics",
      level: "Advanced",
      duration: "12 weeks",
      students: "1,923",
      rating: 4.8,
      description: "Visualize complex mathematical concepts through interactive 3D environments.",
      image: "📐",
      features: ["3D Visualization", "Interactive Graphs", "Problem Solving", "Real Applications"],
      instructor: "Prof. Michael Rodriguez",
      price: "$49",
      progress: 0,
    },
    {
      id: 3,
      title: "Unity Game Development Masterclass",
      category: "technology",
      level: "Intermediate",
      duration: "16 weeks",
      students: "5,234",
      rating: 4.9,
      description:
        "Master Unity game development with advanced animation systems and 3D environments.",
      image: "🎮",
      features: ["Unity Engine", "C# Programming", "3D Animation", "Game Design"],
      instructor: "Alex Thompson",
      price: "$99",
      progress: 0,
    },
    {
      id: 4,
      title: "Digital Art & 3D Modeling",
      category: "arts",
      level: "Beginner",
      duration: "10 weeks",
      students: "3,456",
      rating: 4.7,
      description: "Create stunning 3D art and animations using professional modeling software.",
      image: "🎨",
      features: ["Blender", "3D Modeling", "Texturing", "Animation"],
      instructor: "Emma Wilson",
      price: "$79",
      progress: 0,
    },
    {
      id: 5,
      title: "Virtual Reality Development",
      category: "technology",
      level: "Advanced",
      duration: "14 weeks",
      students: "1,567",
      rating: 4.8,
      description: "Build immersive VR experiences with cutting-edge development tools.",
      image: "🥽",
      features: ["VR Development", "Unity XR", "Interaction Design", "Spatial Computing"],
      instructor: "Dr. James Park",
      price: "$149",
      progress: 0,
    },
    {
      id: 6,
      title: "Environmental Science Simulation",
      category: "science",
      level: "Intermediate",
      duration: "6 weeks",
      students: "2,134",
      rating: 4.6,
      description:
        "Explore ecosystems and environmental processes through interactive simulations.",
      image: "🌱",
      features: ["Ecosystem Modeling", "Climate Simulation", "Data Analysis", "Field Studies"],
      instructor: "Dr. Lisa Green",
      price: "Free",
      progress: 0,
    },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/experiences")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              3D Experiences
            </button>
            <button
              onClick={() => navigate("/library")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Library
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
              Course Catalog
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover comprehensive courses with immersive 3D experiences and interactive learning
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
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

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:scale-105"
            >
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl">
                {course.image}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-sm font-semibold">
                    {course.level}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐</span>
                    <span className="text-sm">{course.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{course.description}</p>

                {/* Course Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.features.slice(0, 2).map((feature, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                  {course.features.length > 2 && (
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-xs">
                      +{course.features.length - 2} more
                    </span>
                  )}
                </div>

                {/* Course Info */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>👨‍🏫 {course.instructor}</span>
                  <span>⏱️ {course.duration}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>👥 {course.students} students</span>
                  <span className="text-lg font-bold text-green-400">{course.price}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate(`/course/${course.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  >
                    {course.progress > 0 ? "Continue Learning" : "Start Course"}
                  </button>

                  <button
                    onClick={() => navigate(`/course/${course.id}/preview`)}
                    className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Preview Course
                  </button>
                </div>

                {/* Progress Bar (if enrolled) */}
                {course.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of students experiencing revolutionary education through immersive
            technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              View My Dashboard
            </button>
            <button
              onClick={() => navigate("/experiences")}
              className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              Explore 3D Experiences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCatalog;
