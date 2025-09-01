import React, { useState } from "react";
import { Navigation } from "../components/Navigation";
import { Dashboard } from "../components/Dashboard";
import { CourseLibrary } from "../components/CourseLibrary";
import { LessonPlayer } from "../components/LessonPlayer";
import GameModes from "../components/GameModes";
import { Leaderboard } from "../components/Leaderboard";
import { AvatarBuilder } from "../components/AvatarBuilder";
import { VirtualWorld } from "../components/VirtualWorld";

const views = {
  dashboard: <Dashboard />,
  courses: <CourseLibrary />,
  lesson: <LessonPlayer />,
  games: <GameModes />,
  leaderboard: <Leaderboard />,
  avatar: <AvatarBuilder />,
  virtual: <VirtualWorld />,
};

export default function MainNavigation() {
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <div className="container mx-auto py-8">
        {views[currentView]}
      </div>
    </div>
  );
}
