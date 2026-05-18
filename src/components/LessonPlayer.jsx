import React, { useEffect, useState } from "react";

import { useLesson } from "../contexts/LessonContext.tsx";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

// Lesson data for different subjects
const lessonData = {
  language: {
    phonics: {
      title: "Phonics Basics",
      steps: [
        { id: "intro", type: "text", content: "Welcome to Phonics! Let's learn letter sounds." },
        { id: "vowels", type: "interactive", content: "Practice vowel sounds: A, E, I, O, U" },
        { id: "consonants", type: "interactive", content: "Practice consonant sounds" },
        { id: "blends", type: "video", content: "Watch: Letter blending" },
        { id: "quiz", type: "quiz", content: "Test your knowledge!" },
      ],
    },
  },
  literacy: {
    reading: {
      title: "Reading Comprehension",
      steps: [
        { id: "intro", type: "text", content: "Let's practice reading together!" },
        { id: "vocabulary", type: "interactive", content: "Learn new sight words" },
        { id: "story", type: "text", content: "Read a short story about animals" },
        { id: "questions", type: "quiz", content: "Answer questions about the story" },
      ],
    },
  },
  numeracy: {
    counting: {
      title: "Counting & Numbers",
      steps: [
        { id: "intro", type: "text", content: "Numbers are fun! Let's count together." },
        { id: "counting", type: "interactive", content: "Count objects from 1 to 20" },
        { id: "addition", type: "interactive", content: "Simple addition exercises" },
        { id: "money", type: "interactive", content: "Recognize Australian coins" },
        { id: "quiz", type: "quiz", content: "Number quiz time!" },
      ],
    },
  },
};

export function LessonPlayer() {
  const { state, setLesson, nextStep, prevStep, setUnderstood } = useLesson();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Interactive activity state — must be declared before any early return (Rules of Hooks)
  const [activityAnswer, setActivityAnswer] = useState("");
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Load lesson when subject/topic selected
  useEffect(() => {
    if (selectedSubject && selectedTopic && lessonData[selectedSubject]?.[selectedTopic]) {
      const lesson = lessonData[selectedSubject][selectedTopic];
      setLesson(selectedSubject, selectedTopic, lesson.steps);
    }
  }, [selectedSubject, selectedTopic, setLesson]);

  // If no lesson is active, show lesson selector
  if (!state.subject || !state.steps.length) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Choose Your Lesson</CardTitle>
          <CardDescription>Select a subject and topic to begin learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(lessonData).map(([subject, topics]) => (
              <div key={subject} className="space-y-2">
                <h3 className="font-semibold capitalize text-lg">{subject}</h3>
                {Object.entries(topics).map(([topic, data]) => (
                  <Button
                    key={topic}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedSubject(subject);
                      setSelectedTopic(topic);
                    }}
                  >
                    📚 {data.title}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStep = state.steps[state.stepIndex];
  const progress = ((state.stepIndex + 1) / state.steps.length) * 100;

  // Phonics activity
  const phonicsVowels = ["A", "E", "I", "O", "U"];
  const phonicsConsonants = ["B", "C", "D", "F", "G", "H"];

  // Simple quiz questions per topic
  const quizQuestions = {
    "language-phonics": {
      question: "Which of these is a vowel?",
      options: ["B", "E", "C"],
      correct: 1,
    },
    "literacy-reading": {
      question: "What sound does 'cat' start with?",
      options: ["/k/", "/s/", "/t/"],
      correct: 0,
    },
    "numeracy-counting": {
      question: "What is 5 + 3?",
      options: ["6", "7", "8"],
      correct: 2,
    },
  };

  const renderStepContent = () => {
    const quizKey = `${state.subject}-${state.topic}`;

    switch (currentStep?.type) {
      case "text":
        return (
          <div className="p-6 bg-blue-50 rounded-lg">
            <p className="text-lg">{currentStep.content}</p>
          </div>
        );
      case "interactive":
        return (
          <div className="p-6 bg-green-50 rounded-lg">
            <p className="text-lg mb-4">{currentStep.content}</p>
            {currentStep.id === "vowels" && (
              <div className="space-y-4">
                <p className="font-semibold">Click each vowel to hear its sound:</p>
                <div className="flex gap-3 flex-wrap">
                  {phonicsVowels.map((v) => (
                    <Button
                      key={v}
                      className="text-2xl w-14 h-14"
                      onClick={() => {
                        if ("speechSynthesis" in window) {
                          const utterance = new SpeechSynthesisUtterance(v);
                          speechSynthesis.speak(utterance);
                        }
                        setFeedback(`Great! ${v} says "${v.toLowerCase()}"`);
                      }}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
                {feedback && <p className="text-green-600 font-medium">{feedback}</p>}
              </div>
            )}
            {currentStep.id === "consonants" && (
              <div className="space-y-4">
                <p className="font-semibold">Click each consonant to hear its sound:</p>
                <div className="flex gap-3 flex-wrap">
                  {phonicsConsonants.map((c) => (
                    <Button
                      key={c}
                      className="text-2xl w-14 h-14"
                      variant="outline"
                      onClick={() => {
                        if ("speechSynthesis" in window) {
                          const utterance = new SpeechSynthesisUtterance(c);
                          speechSynthesis.speak(utterance);
                        }
                        setFeedback(`${c} makes the "${c.toLowerCase()}" sound`);
                      }}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                {feedback && <p className="text-green-600 font-medium">{feedback}</p>}
              </div>
            )}
            {currentStep.id === "vocabulary" && (
              <div className="space-y-4">
                <p className="font-semibold">Match the sight words:</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { word: "the", emoji: "👉" },
                    { word: "and", emoji: "➕" },
                    { word: "is", emoji: "✓" },
                    { word: "it", emoji: "👆" },
                  ].map((w) => (
                    <Button
                      key={w.word}
                      variant="outline"
                      className="text-xl py-4"
                      onClick={() => {
                        if ("speechSynthesis" in window) {
                          speechSynthesis.speak(new SpeechSynthesisUtterance(w.word));
                        }
                        setFeedback(`"${w.word}" - great job!`);
                      }}
                    >
                      {w.emoji} {w.word}
                    </Button>
                  ))}
                </div>
                {feedback && <p className="text-green-600 font-medium">{feedback}</p>}
              </div>
            )}
            {currentStep.id === "counting" && (
              <div className="space-y-4">
                <p className="font-semibold">Count the objects:</p>
                <div className="text-6xl text-center mb-4">🍎🍎🍎🍎🍎</div>
                <div className="flex gap-2 justify-center">
                  {[3, 4, 5, 6].map((n) => (
                    <Button
                      key={n}
                      variant={
                        activityAnswer === String(n)
                          ? n === 5
                            ? "default"
                            : "destructive"
                          : "outline"
                      }
                      onClick={() => {
                        setActivityAnswer(String(n));
                        setFeedback(n === 5 ? "🎉 Correct! There are 5 apples!" : "Try again!");
                      }}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
                {feedback && (
                  <p
                    className={`font-medium ${activityAnswer === "5" ? "text-green-600" : "text-red-600"}`}
                  >
                    {feedback}
                  </p>
                )}
              </div>
            )}
            {currentStep.id === "addition" && (
              <div className="space-y-4">
                <p className="font-semibold">What is 2 + 3?</p>
                <div className="text-4xl text-center mb-4">🔵🔵 + 🔵🔵🔵 = ?</div>
                <div className="flex gap-2 justify-center">
                  {[4, 5, 6].map((n) => (
                    <Button
                      key={n}
                      variant={
                        activityAnswer === String(n)
                          ? n === 5
                            ? "default"
                            : "destructive"
                          : "outline"
                      }
                      onClick={() => {
                        setActivityAnswer(String(n));
                        setFeedback(n === 5 ? "🎉 Correct! 2 + 3 = 5!" : "Not quite, try again!");
                      }}
                    >
                      {n}
                    </Button>
                  ))}
                </div>
                {feedback && (
                  <p
                    className={`font-medium ${activityAnswer === "5" ? "text-green-600" : "text-red-600"}`}
                  >
                    {feedback}
                  </p>
                )}
              </div>
            )}
            {currentStep.id === "money" && (
              <div className="space-y-4">
                <p className="font-semibold">Which coin is this?</p>
                <div className="text-6xl text-center mb-4">🪙</div>
                <p className="text-center text-gray-500">(Gold colored, $1)</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {["50 cents", "$1", "$2"].map((c) => (
                    <Button
                      key={c}
                      variant={
                        activityAnswer === c ? (c === "$1" ? "default" : "destructive") : "outline"
                      }
                      onClick={() => {
                        setActivityAnswer(c);
                        setFeedback(
                          c === "$1"
                            ? "🎉 Correct! This is a $1 coin!"
                            : "That's not right, try again!",
                        );
                      }}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
                {feedback && (
                  <p
                    className={`font-medium ${activityAnswer === "$1" ? "text-green-600" : "text-red-600"}`}
                  >
                    {feedback}
                  </p>
                )}
              </div>
            )}
          </div>
        );
      case "video":
        return (
          <div className="p-6 bg-purple-50 rounded-lg">
            <p className="text-lg mb-4">{currentStep.content}</p>
            <div className="aspect-video bg-gray-800 rounded flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">▶️</div>
                <p>Video demonstration</p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setFeedback("Video would play here in full version!")}
                >
                  Watch Video
                </Button>
              </div>
            </div>
            {feedback && <p className="text-purple-600 font-medium mt-4">{feedback}</p>}
          </div>
        );
      case "quiz":
        const quiz = quizQuestions[quizKey] || {
          question: "Quiz time!",
          options: ["A", "B", "C"],
          correct: 0,
        };
        return (
          <div className="p-6 bg-yellow-50 rounded-lg">
            <p className="text-lg font-semibold mb-4">{quiz.question}</p>
            <div className="space-y-2">
              {quiz.options.map((opt, i) => (
                <Button
                  key={i}
                  variant={
                    quizAnswer === i ? (i === quiz.correct ? "default" : "destructive") : "outline"
                  }
                  className="w-full"
                  onClick={() => {
                    setQuizAnswer(i);
                    setFeedback(
                      i === quiz.correct ? "🎉 Correct! Great job!" : "Not quite right. Try again!",
                    );
                  }}
                >
                  {opt}
                </Button>
              ))}
            </div>
            {feedback && (
              <p
                className={`font-medium mt-4 ${quizAnswer === quiz.correct ? "text-green-600" : "text-red-600"}`}
              >
                {feedback}
              </p>
            )}
          </div>
        );
      default:
        return <p>Unknown step type</p>;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="capitalize">
            {state.subject}: {state.topic}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Step {state.stepIndex + 1} of {state.steps.length}
          </span>
        </div>
        <Progress value={progress} className="mb-4" />
      </CardHeader>
      <CardContent>
        {renderStepContent()}

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              prevStep();
              setFeedback("");
              setActivityAnswer("");
              setQuizAnswer(null);
            }}
            disabled={state.stepIndex === 0}
          >
            ← Previous
          </Button>

          <div className="flex gap-2">
            <Button
              variant={state.understood === true ? "default" : "outline"}
              onClick={() => setUnderstood(true)}
            >
              ✓ I understand
            </Button>
            <Button
              variant={state.understood === false ? "secondary" : "outline"}
              onClick={() => setUnderstood(false)}
            >
              ? Need help
            </Button>
          </div>

          <Button
            onClick={() => {
              nextStep();
              setFeedback("");
              setActivityAnswer("");
              setQuizAnswer(null);
            }}
            disabled={state.stepIndex === state.steps.length - 1}
          >
            Next →
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedSubject(null);
              setSelectedTopic(null);
            }}
          >
            ← Back to lesson list
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
