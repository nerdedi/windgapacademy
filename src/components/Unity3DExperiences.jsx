import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import UnityWebGLComponent from "./UnityWebGLComponent";

function Unity3DExperiences() {
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const unityContainerRef = useRef(null);

  const experiences = [
    {
      id: "molecular-lab",
      title: "Molecular Chemistry Laboratory",
      category: "Science",
      description:
        "Explore molecular structures and chemical reactions in a fully immersive 3D laboratory environment with advanced physics simulation.",
      image: "🧪",
      features: [
        "Real-time molecular visualization",
        "Interactive chemical reactions",
        "Advanced physics simulation",
        "Professional lab equipment",
        "Safety protocols training",
      ],
      difficulty: "Intermediate",
      duration: "45 minutes",
      students: "3,247",
      rating: 4.9,
      unityBuild: "/unity-builds/molecular-lab",
      technologies: ["Unity 2023.2", "C# Scripting", "Physics Engine", "3D Animation"],
    },
    {
      id: "space-exploration",
      title: "Solar System Explorer",
      category: "Astronomy",
      description:
        "Navigate through our solar system with realistic physics, explore planets, and learn about celestial mechanics through interactive experiences.",
      image: "🚀",
      features: [
        "Realistic planetary physics",
        "Interactive spacecraft controls",
        "Educational content overlay",
        "Real astronomical data",
        "Mission-based learning",
      ],
      difficulty: "Beginner",
      duration: "60 minutes",
      students: "5,892",
      rating: 4.8,
      unityBuild: "/unity-builds/space-exploration",
      technologies: ["Unity 2023.2", "Orbital Mechanics", "Procedural Generation", "VR Support"],
    },
    {
      id: "ancient-civilizations",
      title: "Ancient Civilizations VR",
      category: "History",
      description:
        "Walk through historically accurate reconstructions of ancient civilizations with interactive characters and immersive storytelling.",
      image: "🏛️",
      features: [
        "Historically accurate environments",
        "Interactive NPCs with AI",
        "Immersive storytelling",
        "Archaeological discoveries",
        "Cultural learning experiences",
      ],
      difficulty: "Beginner",
      duration: "90 minutes",
      students: "4,156",
      rating: 4.7,
      unityBuild: "/unity-builds/ancient-civilizations",
      technologies: ["Unity 2023.2", "AI Characters", "Photogrammetry", "Narrative System"],
    },
    {
      id: "ecosystem-simulation",
      title: "Ecosystem Dynamics Simulator",
      category: "Biology",
      description:
        "Experience complex ecosystem interactions, food chains, and environmental changes through advanced biological simulation.",
      image: "🌿",
      features: [
        "Complex ecosystem modeling",
        "Predator-prey dynamics",
        "Climate change simulation",
        "Species interaction systems",
        "Data visualization tools",
      ],
      difficulty: "Advanced",
      duration: "75 minutes",
      students: "2,934",
      rating: 4.9,
      unityBuild: "/unity-builds/ecosystem-simulation",
      technologies: ["Unity 2023.2", "AI Behavior Trees", "Procedural Systems", "Data Analytics"],
    },
    {
      id: "engineering-workshop",
      title: "Virtual Engineering Workshop",
      category: "Engineering",
      description:
        "Design, build, and test mechanical systems in a fully equipped virtual workshop with realistic physics and material properties.",
      image: "⚙️",
      features: [
        "CAD-like design tools",
        "Realistic material physics",
        "Stress testing simulation",
        "Professional engineering tools",
        "Collaborative design space",
      ],
      difficulty: "Advanced",
      duration: "120 minutes",
      students: "1,847",
      rating: 4.8,
      unityBuild: "/unity-builds/engineering-workshop",
      technologies: ["Unity 2023.2", "Physics Simulation", "CAD Integration", "Multiplayer"],
    },
    {
      id: "art-studio",
      title: "Digital Art & Animation Studio",
      category: "Arts",
      description:
        "Create stunning 3D art and animations using professional tools in an immersive virtual studio environment.",
      image: "🎨",
      features: [
        "Professional 3D modeling tools",
        "Advanced animation systems",
        "Material and lighting editor",
        "Collaborative art creation",
        "Portfolio showcase system",
      ],
      difficulty: "Intermediate",
      duration: "90 minutes",
      students: "3,672",
      rating: 4.6,
      unityBuild: "/unity-builds/art-studio",
      technologies: ["Unity 2023.2", "Animation Timeline", "Shader Graph", "Version Control"],
    },
  ];

  const loadUnityExperience = (experience) => {
    setIsLoading(true);
    setSelectedExperience(experience);
    setUnityLoaded(false);
    setLoadingProgress(0);
  };

  const handleUnityLoaded = () => {
    setIsLoading(false);
    setUnityLoaded(true);
    console.log("Unity experience loaded successfully");
  };

  const handleUnityProgress = (progress) => {
    setLoadingProgress(progress);
  };

  const handleUnityError = (error) => {
    setIsLoading(false);
    console.error("Unity loading error:", error);
    alert("Failed to load Unity experience. Please try again.");
  };

  const closeExperience = () => {
    setSelectedExperience(null);
    setIsLoading(false);
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
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Dashboard
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

      {/* Unity Experience Modal */}
      {selectedExperience && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold">{selectedExperience.title}</h2>
                <p className="text-gray-400">Unity 3D Experience</p>
              </div>
              <button
                onClick={closeExperience}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Unity Container */}
            <div className="flex-1 p-6">
              <div
                ref={unityContainerRef}
                className="w-full h-full bg-gray-800 rounded-xl relative overflow-hidden"
              >
                <UnityWebGLComponent
                  buildUrl={selectedExperience.unityBuild || "/unity-builds/windgap-academy"}
                  width="100%"
                  height="100%"
                  onLoaded={handleUnityLoaded}
                  onProgress={handleUnityProgress}
                  onError={handleUnityError}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Unity 3D Experiences
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Immersive educational experiences powered by Unity engine with advanced 3D graphics and
            interactive simulations
          </p>
        </div>

        {/* Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:scale-105"
            >
              {/* Experience Preview */}
              <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-6xl relative overflow-hidden">
                {experience.image}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-sm font-semibold">
                  Unity 3D
                </div>
              </div>

              {/* Experience Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full text-sm font-semibold">
                    {experience.category}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span>⭐</span>
                    <span className="text-sm">{experience.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {experience.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {experience.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {experience.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-300">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      {feature}
                    </div>
                  ))}
                  {experience.features.length > 3 && (
                    <div className="text-sm text-gray-400">
                      +{experience.features.length - 3} more features
                    </div>
                  )}
                </div>

                {/* Experience Info */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>⏱️ {experience.duration}</span>
                  <span>🎯 {experience.difficulty}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>👥 {experience.students} students</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => loadUnityExperience(experience)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>🎮</span>
                    <span>Launch Experience</span>
                  </button>

                  <button
                    onClick={() => navigate(`/experience/${experience.id}/info`)}
                    className="w-full border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Learn More
                  </button>
                </div>

                {/* Technologies */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.slice(0, 2).map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Requirements */}
        <div className="mt-20 bg-gray-900 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">💻</div>
              <h3 className="font-semibold mb-2">Browser Support</h3>
              <p className="text-gray-400 text-sm">Chrome 90+, Firefox 88+, Safari 14+, Edge 90+</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🖥️</div>
              <h3 className="font-semibold mb-2">Hardware</h3>
              <p className="text-gray-400 text-sm">
                8GB RAM, Dedicated GPU recommended, WebGL 2.0 support
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-semibold mb-2">Connection</h3>
              <p className="text-gray-400 text-sm">
                Stable internet connection, 10+ Mbps recommended
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Ready for Immersive Learning?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Experience the future of education through Unity-powered 3D environments and interactive
            simulations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/courses")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Browse Courses
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Unity3DExperiences;
