import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { getCharacterForSubject } from "./Characters";
import NumeracyCountingMoneyLesson from "./lessonModules/NumeracyCountingMoneyLesson";
import LanguagePhonicsLesson from "./lessonModules/LanguagePhonicsLesson";
import LiteracyReadingLesson from "./lessonModules/LiteracyReadingLesson";

const subjects = [
  { id: "language", label: "Language", color: "orange-500", component: <LanguagePhonicsLesson /> },
  { id: "literacy", label: "Literacy", color: "teal-500", component: <LiteracyReadingLesson /> },
  { id: "numeracy", label: "Numeracy", color: "yellow-500", component: <NumeracyCountingMoneyLesson /> },
  { id: "digital", label: "Digital Literacy", color: "green-500", component: <div>Digital Literacy Module Coming Soon</div> },
  { id: "independence", label: "Skills for Independence", color: "pink-500", component: <div>Independence Module Coming Soon</div> },
];

export default function SubjectTabs() {
  return (
    <Tabs defaultValue="language" className="w-full">
      <TabsList>
        {subjects.map((subject) => (
          <TabsTrigger key={subject.id} value={subject.id} className={`text-${subject.color}`}>
            {subject.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {subjects.map((subject) => (
        <TabsContent key={subject.id} value={subject.id}>
          <div className="mb-6">
            <h2 className={`text-2xl font-bold text-${subject.color}`}>{subject.label}</h2>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xl">Guide:</span>
              <span className="font-semibold">{getCharacterForSubject(subject.id).name}</span>
              <span className="text-2xl">{getCharacterForSubject(subject.id).avatar}</span>
            </div>
          </div>
          {subject.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
