import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";

const LearningPage = () => {
  // List of all learning modules with their details
  const learningModules = [
    {
      id: "adaptive",
      name: "Adaptive Learning",
      description: "Personalized learning experiences that adapt to student needs",
      path: "/adaptive-demo",
      icon: "🧠",
      color: "from-green-400 to-emerald-500",
    },
    {
      id: "exec-function",
      name: "Executive Function",
      description: "Tools to develop executive function skills",
      path: "/executive-function-demo",
      icon: "📊",
      color: "from-yellow-400 to-amber-500",
    },
    {
      id: "neuro",
      name: "Neurodivergent Learning",
      description: "Specialized learning approaches for neurodivergent students",
      path: "/neurodivergent-learning",
      icon: "🧩",
      color: "from-teal-400 to-cyan-500",
    },
    {
      id: "math",
      name: "Math Exercises",
      description: "Interactive math exercises for different skill levels",
      path: "/exercises/math",
      icon: "🔢",
      color: "from-red-400 to-rose-500",
    },
    {
      id: "adaptive-math",
      name: "Adaptive Math Quest",
      description: "Personalized math learning journey",
      path: "/math/adaptive-quest",
      icon: "📝",
      color: "from-sky-400 to-blue-500",
    },
    {
      id: "fractions",
      name: "Fraction Mastery",
      description: "Master fractions with interactive exercises",
      path: "/math/fraction-mastery",
      icon: "½",
      color: "from-indigo-400 to-violet-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Learning Modules
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Access adaptive learning experiences designed to accommodate different learning styles
            and abilities.
          </p>
        </div>

        {/* Learning Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {learningModules.map((module) => (
            <Link to={module.path} key={module.id}>
              <div
                className={`h-full bg-gradient-to-br ${module.color} rounded-xl p-6 shadow-md text-white relative overflow-hidden hover:scale-105 transition-all duration-300`}
              >
                <div className="text-5xl mb-4">{module.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{module.name}</h3>
                <p className="text-white/80">{module.description}</p>

                <div className="absolute bottom-4 right-4">
                  <span className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm">
                    Start Learning →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">About Our Learning Approach</h2>
          <p className="mb-4">
            Our learning modules are designed with the latest research in educational psychology and
            cognitive science to provide optimized learning experiences for all students.
          </p>
          <p>
            Each module adapts to the learner's pace, preferences, and learning style to ensure
            maximum engagement and knowledge retention.
          </p>
        </div>

        {/* Learning Path Diagram */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Your Learning Journey</h2>
          <div className="relative max-w-3xl mx-auto py-8">
            {/* Learning path steps */}
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-green-500 to-blue-500 transform -translate-x-1/2"></div>

            {/* Step 1 */}
            <div className="relative mb-12">
              <div className="flex items-center mb-2">
                <div className="absolute left-1/2 w-8 h-8 rounded-full bg-green-500 transform -translate-x-1/2 flex items-center justify-center">
                  1
                </div>
                <div className="ml-12">
                  <h3 className="text-xl font-bold text-green-400">Assessment</h3>
                  <p className="text-gray-300">Identify your current skills and learning style</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-12">
              <div className="flex items-center mb-2">
                <div className="absolute left-1/2 w-8 h-8 rounded-full bg-teal-500 transform -translate-x-1/2 flex items-center justify-center">
                  2
                </div>
                <div className="ml-12">
                  <h3 className="text-xl font-bold text-teal-400">Personalization</h3>
                  <p className="text-gray-300">Customize your learning path and preferences</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mb-12">
              <div className="flex items-center mb-2">
                <div className="absolute left-1/2 w-8 h-8 rounded-full bg-cyan-500 transform -translate-x-1/2 flex items-center justify-center">
                  3
                </div>
                <div className="ml-12">
                  <h3 className="text-xl font-bold text-cyan-400">Guided Learning</h3>
                  <p className="text-gray-300">
                    Progress through interactive lessons and exercises
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex items-center mb-2">
                <div className="absolute left-1/2 w-8 h-8 rounded-full bg-blue-500 transform -translate-x-1/2 flex items-center justify-center">
                  4
                </div>
                <div className="ml-12">
                  <h3 className="text-xl font-bold text-blue-400">Mastery</h3>
                  <p className="text-gray-300">Demonstrate your knowledge and skills</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
