import React, { useEffect, useState } from "react";

import { useUser } from "../app/UserContext";
import { useGamification } from "../contexts/GamificationContext";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

// Base mock peers — give the student real competition to aspire to
const MOCK_PEERS = [
  {
    id: 1,
    name: "Alex Chen",
    xp: 2450,
    level: 12,
    streak: 7,
    avatar: "🦊",
    badges: ["⭐", "🏆", "🎯"],
  },
  { id: 2, name: "Sam Wilson", xp: 2100, level: 11, streak: 5, avatar: "🐼", badges: ["⭐", "📚"] },
  {
    id: 3,
    name: "Jordan Lee",
    xp: 1850,
    level: 10,
    streak: 12,
    avatar: "🦁",
    badges: ["🔥", "⭐"],
  },
  { id: 4, name: "Casey Brown", xp: 1600, level: 9, streak: 3, avatar: "🐨", badges: ["⭐"] },
  { id: 5, name: "Riley Davis", xp: 1400, level: 8, streak: 8, avatar: "🦉", badges: ["📖", "⭐"] },
  { id: 6, name: "Morgan Smith", xp: 1200, level: 7, streak: 2, avatar: "🐧", badges: ["⭐"] },
  { id: 7, name: "Taylor Johnson", xp: 1000, level: 6, streak: 4, avatar: "🐰", badges: [] },
  { id: 8, name: "Jamie Garcia", xp: 800, level: 5, streak: 1, avatar: "🦋", badges: [] },
];

const XP_PER_LEVEL = 200;

export function Leaderboard() {
  const { xp, badges, streak } = useGamification();
  const { user } = useUser();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  const currentUserName = user?.id ? user.id.split("@")[0] : "You";
  const currentUserLevel = Math.floor(xp / XP_PER_LEVEL) + 1;

  useEffect(() => {
    setLoading(true);
    // Merge the logged-in user's real stats into the leaderboard
    const meEntry = {
      id: "me",
      name: `${currentUserName} (You)`,
      xp,
      level: currentUserLevel,
      streak,
      avatar: "🌟",
      badges,
      isMe: true,
    };
    const combined = [...MOCK_PEERS, meEntry].sort((a, b) => b.xp - a.xp);
    setTimeout(() => {
      setLeaderboard(combined);
      setLoading(false);
    }, 300);
  }, [filter, xp, streak, badges, currentUserName, currentUserLevel]);

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getProgressToNextLevel = (playerXp) => {
    const xpPerLevel = XP_PER_LEVEL;
    return ((playerXp % xpPerLevel) / xpPerLevel) * 100;
  };

  const myRank = leaderboard.findIndex((p) => p.isMe) + 1;

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading leaderboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">🏆 Leaderboard</CardTitle>
          <div className="flex gap-2">
            {["all", "weekly"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-sm capitalize ${
                  filter === f ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all hover:shadow-md ${
                player.isMe
                  ? "bg-teal-50 border-2 border-teal-400 ring-2 ring-teal-200"
                  : index === 0
                    ? "bg-yellow-50 border-2 border-yellow-200"
                    : index === 1
                      ? "bg-gray-50 border border-gray-200"
                      : index === 2
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-white border border-gray-100"
              }`}
            >
              <div className="w-10 text-center font-bold text-lg">{getRankIcon(index + 1)}</div>
              <div className="text-3xl">{player.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${player.isMe ? "text-teal-700" : ""}`}>
                    {player.name}
                  </span>
                  <Badge variant="secondary">Lvl {player.level}</Badge>
                  {player.streak >= 7 && (
                    <Badge variant="outline" className="text-orange-500">
                      🔥 {player.streak}d
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">{player.xp} XP</span>
                  <Progress value={getProgressToNextLevel(player.xp)} className="w-20 h-1" />
                </div>
              </div>
              <div className="flex gap-1">
                {player.badges.slice(0, 3).map((badge, i) => (
                  <span key={i} className="text-lg" title="Achievement badge">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current User Summary */}
        <div className="mt-6 p-4 bg-teal-50 rounded-lg border-2 border-teal-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Your Position</p>
            <p className="font-bold text-xl text-teal-700">
              {myRank > 0 ? `#${myRank} — ${currentUserName}` : currentUserName}
            </p>
            <p className="text-gray-500 text-sm">
              {xp} XP · Level {currentUserLevel} · 🔥 {streak} day streak
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
