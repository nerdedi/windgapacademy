import React, { useState } from "react";

import { AvatarBuilder } from "./AvatarBuilder";
import { CourseLibrary } from "./CourseLibrary";
import { Dashboard } from "./Dashboard";
import GameArcade from "./GameArcade";
import { Leaderboard } from "./Leaderboard";
import { LessonPlayer } from "./LessonPlayer";
import { Navigation } from "./Navigation";
import VirtualWorld from "./VirtualWorld";

const views = {
  dashboard: <Dashboard />,
  courses: <CourseLibrary />,
  lesson: <LessonPlayer />,
  games: <GameArcade />,
  leaderboard: <Leaderboard />,
  avatar: <AvatarBuilder />,
  virtual: <VirtualWorld />,
};

export default function MainNavigation() {
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <div className="container mx-auto py-8">{views[currentView]}</div>
    </div>
  );
}
