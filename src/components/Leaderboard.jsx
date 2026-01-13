import React, { useEffect, useState } from "react";

import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

// Mock leaderboard data
const mockLeaderboardData = [
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

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filter, setFilter] = useState("all"); // all, weekly, friends
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLeaderboard(mockLeaderboardData);
      setLoading(false);
    }, 500);
  }, [filter]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getProgressToNextLevel = (xp) => {
    const xpPerLevel = 200;
    return ((xp % xpPerLevel) / xpPerLevel) * 100;
  };

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
            {["all", "weekly", "friends"].map((f) => (
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
                index === 0
                  ? "bg-yellow-50 border-2 border-yellow-200"
                  : index === 1
                    ? "bg-gray-50 border border-gray-200"
                    : index === 2
                      ? "bg-orange-50 border border-orange-200"
                      : "bg-white border border-gray-100"
              }`}
            >
              {/* Rank */}
              <div className="w-10 text-center font-bold text-lg">{getRankIcon(index + 1)}</div>

              {/* Avatar */}
              <div className="text-3xl">{player.avatar}</div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{player.name}</span>
                  <Badge variant="secondary">Lvl {player.level}</Badge>
                  {player.streak >= 7 && (
                    <Badge variant="outline" className="text-orange-500">
                      🔥 {player.streak} day streak
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">{player.xp} XP</span>
                  <Progress value={getProgressToNextLevel(player.xp)} className="w-20 h-1" />
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-1">
                {player.badges.map((badge, i) => (
                  <span key={i} className="text-lg" title="Achievement badge">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Current User Stats */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Position</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🦊</span>
              <div>
                <p className="font-bold text-xl">#1 - Alex Chen</p>
                <p className="text-muted-foreground">2,450 XP • Level 12</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
