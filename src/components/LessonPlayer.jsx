import {
  CheckCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BookOpen,
  Trophy,
  Target,
} from "lucide-react";
import React, { useState, useEffect } from "react";

// Import the lesson content service
import { lessonContentService } from "../data/lessons/lessonContentService";

import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function LessonPlayer() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentTab, setCurrentTab] = useState("content");
  const [progress, setProgress] = useState(0);
  const [contentIndex, setContentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryLessons, setCategoryLessons] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Load categories on component mount
  useEffect(() => {
    const allLessons = lessonContentService.getAllLessons();
    const uniqueCategories = [...new Set(allLessons.map((lesson) => lesson.category))];
    setCategories(uniqueCategories);

    // Set default category if available
    if (uniqueCategories.length > 0) {
      handleCategorySelect(uniqueCategories[0]);
    }
  }, []);

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const lessons = lessonContentService.getLessonsByCategory(category);
    setCategoryLessons(lessons);
    setSelectedLesson(null);
    setContentIndex(0);
    setProgress(0);
  };

  // Handle difficulty filter change
  const handleDifficultyFilterChange = (difficulty) => {
    setDifficultyFilter(difficulty);
    if (selectedCategory) {
      let lessons = lessonContentService.getLessonsByCategory(selectedCategory);
      if (difficulty !== "all") {
        lessons = lessons.filter((lesson) => lesson.difficultyLevel === difficulty);
      }
      setCategoryLessons(lessons);
      setSelectedLesson(null);
      setContentIndex(0);
      setProgress(0);
    }
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setContentIndex(0);
    setProgress(0);
  };

  // Navigate through lesson content
  const nextContent = () => {
    if (selectedLesson && contentIndex < selectedLesson.content.length - 1) {
      setContentIndex(contentIndex + 1);
      setProgress(((contentIndex + 1) / selectedLesson.content.length) * 100);
    }
  };

  const prevContent = () => {
    if (selectedLesson && contentIndex > 0) {
      setContentIndex(contentIndex - 1);
      setProgress(((contentIndex - 1) / selectedLesson.content.length) * 100);
    }
  };

  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Render current content
  const renderContent = () => {
    if (!selectedLesson) {
      return (
        <div className="text-center p-8">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Select a lesson to begin</h3>
          <p className="mt-2 text-sm text-gray-500">
            Choose from the available lessons in the selected category
          </p>
        </div>
      );
    }

    const currentContent = selectedLesson.content[contentIndex];

    switch (currentContent.type) {
      case "text":
        return (
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-4">{currentContent.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: currentContent.body }} />
          </div>
        );
      case "image":
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">{currentContent.title || "Image"}</h2>
            <img
              src={currentContent.src}
              alt={currentContent.alt}
              className="mx-auto max-h-96 rounded-lg shadow-md"
            />
            {currentContent.caption && (
              <p className="mt-2 text-sm text-gray-500">{currentContent.caption}</p>
            )}
          </div>
        );
      case "video":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentContent.title}</h2>
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <iframe
                src={currentContent.src}
                className="w-full h-full rounded-lg shadow-md"
                title={currentContent.title}
                allowFullScreen
              ></iframe>
            </div>
            {currentContent.transcript && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Transcript</h3>
                <p className="text-sm text-gray-700">{currentContent.transcript}</p>
              </div>
            )}
          </div>
        );
      case "audio":
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">{currentContent.title}</h2>
            <audio controls className="w-full mb-4" src={currentContent.src}></audio>
            {currentContent.transcript && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Transcript</h3>
                <p className="text-sm text-gray-700">{currentContent.transcript}</p>
              </div>
            )}
          </div>
        );
      case "interactive":
        return (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <h2 className="text-xl font-bold mb-4">{currentContent.title}</h2>
            <p className="mb-4">{currentContent.description}</p>
            <Button>Launch Interactive Exercise</Button>
            <p className="mt-4 text-sm text-gray-500">
              Interactive elements will be available in the full version.
            </p>
          </div>
        );
      default:
        return (
          <div className="text-center p-8">
            <p>Content type not supported</p>
          </div>
        );
    }
  };

  // Render the lesson player UI
  return (
    <div className="flex flex-col h-full">
      {/* Category and lesson selection */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">Filter by difficulty:</h3>
              <Badge
                variant={difficultyFilter === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleDifficultyFilterChange("all")}
              >
                All
              </Badge>
              <Badge
                variant={difficultyFilter === "beginner" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleDifficultyFilterChange("beginner")}
              >
                Beginner
              </Badge>
              <Badge
                variant={difficultyFilter === "intermediate" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleDifficultyFilterChange("intermediate")}
              >
                Intermediate
              </Badge>
              <Badge
                variant={difficultyFilter === "advanced" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleDifficultyFilterChange("advanced")}
              >
                Advanced
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedLesson?.id === lesson.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleLessonSelect(lesson)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <CardDescription>
                      {lesson.duration} min · {lesson.difficultyLevel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lesson content display */}
      {selectedLesson && (
        <Card className="flex-1">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedLesson.title}</CardTitle>
              <CardDescription>
                {selectedLesson.category} · {selectedLesson.difficultyLevel}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={togglePause}>
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>

            <Tabs defaultValue="content" value={currentTab} onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="objectives">Objectives</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="assessments">Assessments</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="min-h-[300px]">
                {renderContent()}
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevContent} disabled={contentIndex === 0}>
                    <SkipBack className="h-4 w-4 mr-2" /> Previous
                  </Button>
                  <Button
                    onClick={nextContent}
                    disabled={contentIndex === selectedLesson.content.length - 1}
                  >
                    Next <SkipForward className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="objectives">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Target className="h-5 w-5 mr-2" /> Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {selectedLesson.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedLesson.prerequisites.length > 0 && (
                    <>
                      <h3 className="text-lg font-medium mt-6">Prerequisites</h3>
                      <ul className="space-y-2">
                        {selectedLesson.prerequisites.map((prerequisite, index) => (
                          <li key={index} className="flex items-start">
                            <BookOpen className="h-5 w-5 mr-2 text-blue-500 shrink-0" />
                            <span>{prerequisite}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="activities">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Practical Activities</h3>
                  {selectedLesson.activities.map((activity, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{activity.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{activity.description}</p>
                        {activity.steps && (
                          <div>
                            <h4 className="font-medium mb-2">Steps:</h4>
                            <ol className="list-decimal list-inside space-y-1">
                              {activity.steps.map((step, idx) => (
                                <li key={idx} className="text-sm">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="assessments">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Trophy className="h-5 w-5 mr-2" /> Assessments
                  </h3>
                  {selectedLesson.assessments.map((assessment, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{assessment.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-3">{assessment.description}</p>
                        <Button className="w-full">Start Assessment</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
