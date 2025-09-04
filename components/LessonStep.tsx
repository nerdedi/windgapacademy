import React from "react";

type StepProps = {
  type: string;
  content?: string;
  src?: string;
  options?: any[];
};

export default function LessonStep({ type, content, src }: StepProps) {
  if (type === "text") return <div className="mb-4 text-left">{content}</div>;
  if (type === "image") return <img src={src} alt={content || "lesson image"} className="mb-4" />;
  if (type === "quiz")
    return (
      <div className="mb-4">
        <div className="font-semibold">Quiz</div>
        <div>{content}</div>
      </div>
    );
  return null;
}
