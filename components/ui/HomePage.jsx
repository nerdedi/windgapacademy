import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  function goLogin() {
    // Navigate to app root where the login UI is shown by App when unauthenticated
    navigate("/");
    // In this app, the login UI is shown when the MainApp showsLogin state is true
  }

  const features = [
    {
      icon: "🎯",
      title: "NDIS Goal Tracking",
      desc: "Define, measure and report on individual goals.",
      link: "/courses",
    },
    {
      icon: "📊",
      title: "Progress Monitoring",
      desc: "Visual dashboards and progress history for learners.",
      link: "/dashboard",
    },
    {
      icon: "💡",
      title: "Funding Insights",
      desc: "Plan and justify future funding needs with evidence.",
      link: "/educator",
    },
  ];

  const quickLinks = [
    { icon: "📚", title: "Courses", desc: "LLND learning modules", path: "/courses" },
    { icon: "📖", title: "Lessons", desc: "Interactive learning", path: "/lessons" },
    { icon: "🎮", title: "Games", desc: "Educational arcade", path: "/games" },
    { icon: "🌏", title: "Virtual World", desc: "Explore Sydney", path: "/virtual-world" },
    { icon: "🏆", title: "Leaderboard", desc: "Track achievements", path: "/leaderboard" },
    { icon: "👤", title: "Avatar", desc: "Customize your look", path: "/avatar" },
  ];

  const simulations = [
    { icon: "🛒", title: "Supermarket", path: "/supermarket" },
    { icon: "🏠", title: "Clubhouse", path: "/clubhouse" },
    { icon: "🍳", title: "Kitchen", path: "/kitchen" },
    { icon: "🧘", title: "Calm Space", path: "/calmspace" },
    { icon: "🦁", title: "Zoo", path: "/zoo" },
  ];

  return (
    <main className="max-w-5xl mx-auto p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0B6E8F]">Windgap Academy</h1>
        <p className="text-lg text-gray-700 mt-2">
          Empowering educators and learners to plan, track and report on meaningful outcomes aligned
          with NDIS goals.
        </p>
      </header>

      {/* Quick Start Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">🚀 Quick Start</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105 text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="intro-section mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">What we offer</h2>
        <p className="text-gray-600 text-center mb-6">
          A secure, accessible learning platform for educators and learners. Create NDIS-aligned
          goals, monitor progress, and prepare compliant reports.
        </p>

        <div className="features grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="feature p-6 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Simulations Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">🌍 Life Skills Simulations</h2>
        <p className="text-gray-600 text-center mb-6">
          Practice real-world skills in safe, interactive virtual environments.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {simulations.map((sim) => (
            <Link
              key={sim.path}
              to={sim.path}
              className="px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <span className="text-2xl">{sim.icon}</span>
              <span className="font-medium">{sim.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center bg-gradient-to-r from-[#5ED1D2] to-[#0B6E8F] text-white p-8 rounded-2xl mb-8">
        <h2 className="text-2xl font-bold mb-3">Ready to start learning?</h2>
        <p className="mb-6">Join thousands of learners on their journey to independence.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={goLogin}
            className="px-6 py-3 bg-white text-[#0B6E8F] rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Log in to your account
          </button>
          <Link
            to="/games"
            className="px-6 py-3 bg-[#A32C2B] text-white rounded-lg font-semibold hover:bg-[#8a2424] transition-all"
          >
            Try Games Free
          </Link>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-12">
        <p>Designed for educators, trusted by families. Privacy and accessibility at the core.</p>
        <p className="mt-2">© 2026 Windgap Academy. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default HomePage;
