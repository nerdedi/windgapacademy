import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  function goLogin() {
    // Navigate to app root where the login UI is shown by App when unauthenticated
    navigate("/");
    // In this app, the login UI is shown when the MainApp showsLogin state is true
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#0B6E8F]">Windgap Academy</h1>
        <p className="text-lg text-gray-700 mt-2">
          Empowering educators and learners to plan, track and report on meaningful outcomes aligned
          with NDIS goals.
        </p>
      </header>

      <section className="intro-section mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-3">What we offer</h2>
        <p className="text-gray-600">
          A secure, accessible learning platform for educators and learners. Create NDIS-aligned
          goals, monitor progress, and prepare compliant reports.
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
              Plan and justify future funding needs with evidence.
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
        </div>
      </section>

      <footer className="text-center text-sm text-gray-500 mt-12">
        <p>Designed for educators, trusted by families. Privacy and accessibility at the core.</p>
      </footer>
    </main>
  );
};

export default HomePage;
