import { useNavigate } from "react-router-dom.js";

const HomePage = () => {
  const navigate = useNavigate();

  function goLogin() {
    navigate("/login", { state: { from: "home" } });
    console.log("goLogin", navigate);
  }
  function goSignup() {
    navigate("/signup", { state: { from: "home" } });
    console.log("goSignup", navigate);
  }
  function goDashboard() {
    navigate("/dashboard", { state: { from: "home" } });
    console.log("goDashboard", navigate);
  }
  function goLearnerDashboard() {
    navigate("/learner-dashboard", { state: { from: "home" } });
    console.log("goLearnerDashboard", navigate);
  }
  function goEducatorDashboard() {
    navigate("/educator-dashboard", { state: { from: "home" } });
    console.log("goEducatorDashboard", navigate);
  }
  function goGames() {
    navigate("/games", { state: { from: "home" } });
    console.log("goGames", navigate);
  }
  function goHelp() {
    navigate("/help", { state: { from: "home" } });
    console.log("goHelp", navigate);
  }
  function goContact() {
    navigate("/contact", { state: { from: "home" } });
    console.log("goContact", navigate);
  }
  function goPrivacy() {
    navigate("/privacy", { state: { from: "home" } });
    console.log("goPrivacy", navigate);
  }
  function goTerms() {
    navigate("/terms", { state: { from: "home" } });
    console.log("goTerms", navigate);
  }
  function goAccessibility() {
    navigate("/accessibility", { state: { from: "home" } });
    console.log("goAccessibility", navigate);
  }
  function goSupport() {
    navigate("/support", { state: { from: "home" } });
    console.log("goSupport", navigate);
  }
  function goAbout() {
    navigate("/about", { state: { from: "home" } });
    console.log("goAbout", navigate);
  }
  function goCurriculum() {
    navigate("/curriculum", { state: { from: "home" } });
    console.log("goCurriculum", navigate);
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0B6E8F]">Windgap Academy</h1>
        <p className="text-lg text-gray-700 mt-2">
          Empowering educators and learners to plan, track and report on meaningful outcomes aligned
          with learning goals and NDIS goals.
        </p>
      </header>

      <section className="intro-section mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-3">What we offer</h2>
        <p className="text-gray-600">
          A secure, accessible learning platform for educators and learners. Create NDIS-aligned
          goals, monitor progress, and prepare compliant reports. All in one place.
        </p>

        <div className="features grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="feature p-4">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold">NDIS Goal Tracking</h3>
            <p className="text-sm text-gray-600">Define, measure and report on individual goals.</p>
          </div>
          <div className="feature p-4">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold">Progress Monitoring</h3>
            <p className="text-sm text-gray-600">
              Visual dashboards and progress history for learners.
            </p>
          </div>
          <div className="feature p-4">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-semibold">Funding Insights</h3>
            <p className="text-sm text-gray-600">
              Analyze funding patterns and identify opportunities for growth. Plan and justify
              future funding needs with evidence.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={goLogin}
            className="px-6 py-3 bg-[#0B6E8F] text-white rounded font-semibold"
          >
            Log in to your account
          </button>
          <button
            onClick={goSignup}
            className="ml-4 px-6 py-3 bg-green-600 text-white rounded font-semibold"
          >
            Sign up
          </button>
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-12">
        <p>Designed for all types of learners. Privacy and accessibility at the core.</p>
        <div className="mt-4 space-x-4">
          <button onClick={goDashboard} className="text-blue-600 hover:underline">
            Dashboard
          </button>
          <button onClick={goLearnerDashboard} className="text-blue-600 hover:underline">
            Learner Dashboard
          </button>
          <button onClick={goEducatorDashboard} className="text-blue-600 hover:underline">
            Educator Dashboard
          </button>
          <button onClick={goGames} className="text-blue-600 hover:underline">
            Games
          </button>
          <button onClick={goCurriculum} className="text-blue-600 hover:underline">
            Curriculum
          </button>
        </div>
        <div className="mt-2 space-x-4">
          <button onClick={goHelp} className="text-blue-600 hover:underline">
            Help
          </button>
          <button onClick={goContact} className="text-blue-600 hover:underline">
            Contact
          </button>
          <button onClick={goPrivacy} className="text-blue-600 hover:underline">
            Privacy
          </button>
          <button onClick={goTerms} className="text-blue-600 hover:underline">
            Terms
          </button>
          <button onClick={goAccessibility} className="text-blue-600 hover:underline">
            Accessibility
          </button>
          <button onClick={goSupport} className="text-blue-600 hover:underline">
            Support
          </button>
          <button onClick={goAbout} className="text-blue-600 hover:underline">
            About
          </button>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
