import { Link } from "react-router-dom";

// GamificationContext lives in src — import via relative path
import { useUser } from "../../src/app/UserContext";
import { useGamification } from "../../src/contexts/GamificationContext";

const XP_PER_LEVEL = 200;

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-gray-800">{value}</span>
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
}

function ProgressBar({ value, max, label }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="mb-1">
      {label && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label}</span>
          <span>
            {value} / {max} XP
          </span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-teal-400 to-teal-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}

const quickLinks = [
  { to: "/games", label: "🎮 Play Games", bg: "bg-teal-50 hover:bg-teal-100 border-teal-200" },
  {
    to: "/courses",
    label: "📚 Browse Courses",
    bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",
  },
  {
    to: "/lessons",
    label: "📖 Start Lesson",
    bg: "bg-purple-50 hover:bg-purple-100 border-purple-200",
  },
  {
    to: "/avatar",
    label: "👤 Edit Avatar",
    bg: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
  },
  {
    to: "/leaderboard",
    label: "🏆 Leaderboard",
    bg: "bg-orange-50 hover:bg-orange-100 border-orange-200",
  },
  {
    to: "/supermarket",
    label: "🛒 Supermarket",
    bg: "bg-green-50 hover:bg-green-100 border-green-200",
  },
];

const LearnerDashboard = () => {
  const { xp, badges, streak } = useGamification();
  const { user } = useUser();

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const displayName = user?.id ? `Student (${user.id.split("@")[0]})` : "Student";

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[#0B6E8F]">Welcome back, {displayName} 👋</h2>
        <p className="text-gray-500 mt-1">Here&apos;s your learning progress today.</p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total XP" value={xp} icon="⭐" color="border-yellow-400" />
        <StatCard label="Level" value={level} icon="🏅" color="border-teal-400" />
        <StatCard label="Day Streak" value={streak} icon="🔥" color="border-orange-400" />
        <StatCard label="Badges Earned" value={badges.length} icon="🎖️" color="border-purple-400" />
      </div>

      {/* XP progress to next level */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Progress to Level {level + 1}</h3>
        <ProgressBar value={xpInLevel} max={XP_PER_LEVEL} label={`Level ${level} → ${level + 1}`} />
        <p className="text-xs text-gray-400 mt-2">
          {XP_PER_LEVEL - xpInLevel} XP needed to reach the next level.
        </p>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">🎖️ My Badges</h3>
        {badges.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No badges yet — play games and complete lessons to earn your first badge!
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {badges.map((b, i) => (
              <span
                key={i}
                className="text-2xl bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1"
                title={b}
              >
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl shadow p-5">
        <h3 className="font-semibold text-gray-700 mb-3">🚀 Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickLinks.map(({ to, label, bg }) => (
            <Link
              key={to}
              to={to}
              className={`block text-center border rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors ${bg}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;
