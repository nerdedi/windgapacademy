import React from "react";

function ReadingTextActivity() {
  return (
    <div className="mb-4">
      <h4>Reading Practice</h4>
      <p>Read a short text and answer simple questions.</p>
      {/* ...text and question UI... */}
    </div>
  );
}

function SignsAndSymbolsActivity() {
  return (
    <div className="mb-4">
      <h4>Signs and Symbols</h4>
      <p>Match common signs to their meaning.</p>
      {/* ...signs and matching UI... */}
    </div>
  );
}

function LiteracyChecklist() {
  return (
    <div className="mb-4">
      <h4>Literacy Skills Checklist</h4>
      <ul>
        <li>Reads short texts</li>
        <li>Recognises signs and symbols</li>
        <li>Answers simple questions about a text</li>
      </ul>
    </div>
  );
}

function EasyReadLiteracyVisuals() {
  return (
    <div className="mb-4">
      <h4>Easy Read: Literacy Visuals</h4>
      <img src="/assets/easy-read/signs.png" alt="Signs visuals" />
    </div>
  );
}

export default function LiteracyReadingLesson() {
  const objectives = [
    "Read and interpret short texts",
    "Recognise signs and symbols",
    "Answer questions about a text",
  ];
  return (
    <div className="lesson-module p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Literacy: Reading & Signs</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Learning Objectives</h3>
        <ul className="list-disc ml-6">
          {objectives.map((obj, idx) => (
            <li key={idx}>{obj}</li>
          ))}
        </ul>
      </div>
      <ReadingTextActivity />
      <SignsAndSymbolsActivity />
      <LiteracyChecklist />
      <EasyReadLiteracyVisuals />
    </div>
  );
}
