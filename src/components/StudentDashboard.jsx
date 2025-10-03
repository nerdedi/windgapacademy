import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function LearnerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("windgap_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("windgap_user");
    navigate("/");
  };

  const llndModules = [
    {
      id: "life-skills",
      icon: "🏠",
      title: "Life Skills",
      description: "Travel Training, Cooking, Hygiene, Shopping",
      progress: 65,
      modules: 10,
      color: "bg-blue-500",
      lessonRoute: "/lesson/life-skills",
    },
    {
      id: "employment",
      icon: "💼",
      title: "Employment Skills",
      description: "Resume Writing, Interview Practice, Workplace Behaviour",
      progress: 40,
      modules: 6,
      color: "bg-green-500",
      lessonRoute: "/lesson/employment",
    },
    {
      id: "digital-literacy",
      icon: "💻",
      title: "Digital Literacy",
      description: "Using Email, Online Safety, Searching the Web",
      progress: 80,
      modules: 6,
      color: "bg-purple-500",
      lessonRoute: "/lesson/digital-literacy",
    },
    {
      id: "numeracy",
      icon: "🔢",
      title: "Numeracy",
      description: "Recognising Numbers, Money & Budgeting, Time",
      progress: 55,
      modules: 8,
      color: "bg-orange-500",
      lessonRoute: "/exercises/math",
    },
    {
      id: "literacy",
      icon: "📖",
      title: "Literacy & Language",
      description: "Reading Signs, Following Instructions, Writing",
      progress: 70,
      modules: 10,
      color: "bg-red-500",
      lessonRoute: "/lesson/literacy-reading",
    },
    {
      id: "emotional",
      icon: "💭",
      title: "Emotional Regulation",
      description: "Recognising Emotions, Coping Strategies",
      progress: 30,
      modules: 6,
      color: "bg-pink-500",
      lessonRoute: "/lesson/emotional",
    },
  ];

  const quickActions = [
    {
      icon: "📚",
      title: "Continue Learning",
      description: "Resume your current lesson",
      action: () => navigate("/lesson/literacy-reading"),
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      textColor: "text-blue-700",
    },
    {
      icon: "🧮",
      title: "Math Exercises",
      description: "Interactive math practice",
      action: () => navigate("/exercises/math"),
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      textColor: "text-green-700",
    },
    {
      icon: "📊",
      title: "View Progress",
      description: "See your learning analytics",
      action: () => navigate("/lesson/language-phonics"),
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      textColor: "text-purple-700",
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "View your badges and certificates",
      action: () => navigate("/dashboard"),
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
      textColor: "text-orange-700",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Apple-style Navigation */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button onClick={() => navigate("/")} className="text-2xl font-semibold text-black">
              Windgap Academy
            </button>
            <div className="text-sm text-gray-600">Welcome back, {user.name}</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">Learning Dashboard</h1>
          <p className="text-xl text-gray-600">
            Continue your Learning and Life Navigation Development journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`group ${action.color} rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 text-left`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className={`font-bold ${action.textColor} mb-2 group-hover:text-opacity-80`}>
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-gray-700">
                  {action.description}
                </p>
                <div
                  className={`mt-3 ${action.textColor} group-hover:translate-x-2 transition-transform duration-300`}
                >
                  <span className="text-lg">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* LLND Learning Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {llndModules.map((module) => (
              <button
                key={module.id}
                onClick={() => navigate(module.lessonRoute || `/module/${module.id}`)}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-gray-100 hover:border-blue-200 text-left w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {module.icon}
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full ${module.color} group-hover:scale-110 transition-transform duration-300`}
                  ></div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {module.title}
                </h3>
                <p className="text-gray-600 mb-6 text-base leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {module.description}
                </p>

                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <span className="font-medium">Progress</span>
                    <span className="font-bold">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${module.color} group-hover:brightness-110`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 font-medium">
                    {module.modules} modules
                  </span>
                  <div className="bg-blue-600 group-hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 group-hover:scale-105 shadow-lg flex items-center gap-2">
                    <span>Continue</span>
                    <span className="text-lg group-hover:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-2xl font-semibold text-black mb-6">Recent Activity</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-medium text-black">Completed: Basic Keyboarding</div>
                  <div className="text-sm text-gray-600">Digital Skills • 2 hours ago</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">📖</div>
                <div>
                  <div className="font-medium text-black">Started: Reading Signs & Symbols</div>
                  <div className="text-sm text-gray-600">Literacy & Language • 1 day ago</div>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl">🏆</div>
                <div>
                  <div className="font-medium text-black">
                    Achievement Unlocked: First Week Complete
                  </div>
                  <div className="text-sm text-gray-600">General • 3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnerDashboard;
