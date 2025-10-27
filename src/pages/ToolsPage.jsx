import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const ToolsPage = () => {
  // List of all tool components with their details
  const tools = [
    {
      id: "fluid",
      name: "Fluid Simulation",
      description: "Interactive fluid physics simulation using WebGL",
      path: "/tools/fluid-simulation",
      icon: "💧",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "whiteboard",
      name: "Whiteboard",
      description: "Interactive digital whiteboard for teaching and brainstorming",
      path: "/tools/whiteboard",
      icon: "✏️",
      color: "from-gray-500 to-gray-700",
    },
    {
      id: "ripple",
      name: "Ripple Effect",
      description: "Interactive ripple animations using WebGL shaders",
      path: "/tools/ripple-effect",
      icon: "🌊",
      color: "from-blue-400 to-indigo-500",
    },
    {
      id: "webgl",
      name: "WebGL Effects",
      description: "Various visual effects powered by WebGL",
      path: "/tools/webgl-effects",
      icon: "✨",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "character",
      name: "Character Animation",
      description: "Character animation system for educational games",
      path: "/tools/character-animation",
      icon: "🏃",
      color: "from-orange-400 to-red-500",
    },
    {
      id: "ai",
      name: "AI Assistant",
      description: "AI-powered learning assistant",
      path: "/ai-assistant",
      icon: "🤖",
      color: "from-violet-400 to-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            Interactive Learning Tools
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore our collection of interactive tools designed to enhance the learning experience
            through visual and hands-on engagement.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {tools.map((tool) => (
            <Link to={tool.path} key={tool.id}>
              <div
                className={`h-full bg-gradient-to-br ${tool.color} rounded-xl p-6 shadow-md text-white relative overflow-hidden hover:scale-105 transition-all duration-300`}
              >
                <div className="text-5xl mb-4">{tool.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{tool.name}</h3>
                <p className="text-white/80">{tool.description}</p>

                <div className="absolute bottom-4 right-4">
                  <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
                    Open Tool →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">About Our Tools</h2>
          <p className="mb-4">
            All tools in this collection are designed to provide engaging, interactive learning
            experiences. They leverage WebGL and advanced web technologies to create immersive
            educational environments.
          </p>
          <p>
            These tools can be integrated into lesson plans or used independently for exploration
            and discovery. Educators can use these tools to visualize complex concepts and make
            learning more engaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;
