import React from "react";

import LessonModule from "../../components/LessonModule";
import LessonStep from "../../components/LessonStep";
import SubjectTabs from "../../components/SubjectTabs";
import UnderstandingCheck from "../../components/UnderstandingCheck";
import { useLesson } from "../contexts/LessonContext";

export default function DemoLesson() {
  const { setLesson } = useLesson();
  React.useEffect(() => {
    setLesson("Literacy", "Reading Fluency", [
      { id: "s1", type: "text", content: "What is reading fluency?" },
      { id: "s2", type: "image", src: "/assets/fluency.png", content: "Fluency image" },
      { id: "s3", type: "quiz", content: "Which sentence is fluent?" },
    ]);
  }, [setLesson]);

  return (
    <LessonModule subject="Literacy" topic="Reading Fluency">
      <LessonStep type="text" content="What is reading fluency?" />
      <LessonStep type="image" src="/assets/fluency.png" />
      <LessonStep type="quiz" content="Which sentence is fluent?" />
      <UnderstandingCheck />
    </LessonModule>
  );
}
