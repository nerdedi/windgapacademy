import React from "react";

type Props = {
  subject: string;
  topic: string;
  children: React.ReactNode;
};

export default function LessonModule({ subject, topic, children }: Props) {
  // this component acts as a container; actual step management is via LessonContext
  return (
    <section aria-labelledby={`lesson-${subject}-${topic}`} className="p-4">
      <h2 id={`lesson-${subject}-${topic}`} className="text-xl font-bold mb-2">
        {subject} — {topic}
      </h2>
      <div className="lesson-steps">{children}</div>
    </section>
  );
}
