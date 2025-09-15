import React, { useState, useEffect } from "react";
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
    },
    {
      id: "employment",
      icon: "💼",
      title: "Employment Skills",
      description: "Resume Writing, Interview Practice, Workplace Behaviour",
      progress: 40,
      modules: 6,
      color: "bg-green-500",
    },
    {
      id: "digital-literacy",
      icon: "💻",
      title: "Digital Literacy",
      description: "Using Email, Online Safety, Searching the Web",
      progress: 80,
      modules: 6,
      color: "bg-purple-500",
    },
    {
      id: "numeracy",
      icon: "🔢",
      title: "Numeracy",
      description: "Recognising Numbers, Money & Budgeting, Time",
      progress: 55,
      modules: 8,
      color: "bg-orange-500",
    },
    {
      id: "literacy",
      icon: "📖",
      title: "Literacy & Language",
      description: "Reading Signs, Following Instructions, Writing",
      progress: 70,
      modules: 10,
      color: "bg-red-500",
    },
    {
      id: "emotional",
      icon: "💭",
      title: "Emotional Regulation",
      description: "Recognising Emotions, Coping Strategies",
      progress: 30,
      modules: 6,
      color: "bg-pink-500",
    },
  ];

  const quickActions = [
    {
      icon: "📚",
      title: "Continue Learning",
      description: "Resume your current lesson",
      action: () => navigate("/lesson/current"),
    },
    {
      icon: "🎮",
      title: "Interactive Games",
      description: "Practice skills through games",
      action: () => navigate("/games"),
    },
    {
      icon: "📊",
      title: "View Progress",
      description: "See your learning analytics",
      action: () => navigate("/progress"),
    },
    {
      icon: "🏆",
      title: "Achievements",
      description: "View your badges and certificates",
      action: () => navigate("/achievements"),
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
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 text-left"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-semibold text-black mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* LLND Learning Modules */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-black mb-6">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {llndModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{module.icon}</div>
                  <div className={`w-3 h-3 rounded-full ${module.color}`}></div>
                </div>

                <h3 className="text-xl font-semibold text-black mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{module.description}</p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${module.color}`}
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{module.modules} modules</span>
                  <button
                    onClick={() => navigate(`/module/${module.id}`)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
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
