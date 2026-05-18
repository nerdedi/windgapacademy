import React from "react";

import DigitalLiteracyLesson from "./lessonModules/DigitalLiteracyLesson";
import IndependenceSkillsLesson from "./lessonModules/IndependenceSkillsLesson";
import LanguagePhonicsLesson from "./lessonModules/LanguagePhonicsLesson";
import LiteracyReadingLesson from "./lessonModules/LiteracyReadingLesson";
import NumeracyCountingMoneyLesson from "./lessonModules/NumeracyCountingMoneyLesson";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const subjects = [
  {
    id: "language",
    label: "🔤 Language",
    color: "purple-600",
    component: <LanguagePhonicsLesson />,
  },
  {
    id: "literacy",
    label: "📖 Literacy",
    color: "amber-600",
    component: <LiteracyReadingLesson />,
  },
  {
    id: "numeracy",
    label: "🔢 Numeracy",
    color: "teal-600",
    component: <NumeracyCountingMoneyLesson />,
  },
  { id: "digital", label: "💻 Digital", color: "orange-600", component: <DigitalLiteracyLesson /> },
  {
    id: "independence",
    label: "🏠 Independence",
    color: "green-600",
    component: <IndependenceSkillsLesson />,
  },
];

export default function SubjectTabs() {
  return (
    <Tabs defaultValue="language" className="w-full">
      <TabsList className="flex flex-wrap gap-1 h-auto p-1">
        {subjects.map((subject) => (
          <TabsTrigger key={subject.id} value={subject.id} className="text-sm font-semibold">
            {subject.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {subjects.map((subject) => (
        <TabsContent key={subject.id} value={subject.id} className="mt-4">
          {subject.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
