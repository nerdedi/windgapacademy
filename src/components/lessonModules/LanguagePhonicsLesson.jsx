import React from "react";

function AlphabetSoundsActivity() {
  return (
    <div className="mb-4">
      <h4>Alphabet Sounds</h4>
      <p>Listen to each letter and match it to its sound.</p>
      {/* ...audio and matching UI... */}
    </div>
  );
}

function SightWordsActivity() {
  return (
    <div className="mb-4">
      <h4>Sight Words</h4>
      <p>Practice reading and spelling high-frequency words.</p>
      {/* ...interactive sight word UI... */}
    </div>
  );
}

function SentenceStartersActivity() {
  return (
    <div className="mb-4">
      <h4>Sentence Starters</h4>
      <p>Build sentences using starter phrases.</p>
      {/* ...sentence building UI... */}
    </div>
  );
}

function LanguageChecklist() {
  return (
    <div className="mb-4">
      <h4>Language Skills Checklist</h4>
      <ul>
        <li>Knows alphabet and sounds</li>
        <li>Reads sight words</li>
        <li>Builds simple sentences</li>
      </ul>
    </div>
  );
}

function EasyReadLanguageVisuals() {
  return (
    <div className="mb-4">
      <h4>Easy Read: Language Visuals</h4>
      <img src="/assets/easy-read/alphabet.png" alt="Alphabet visuals" />
    </div>
  );
}

export default function LanguagePhonicsLesson() {
  const objectives = [
    "Knowledge of the alphabet and sounds",
    "Read and spell sight words",
    "Build simple sentences",
  ];
  return (
    <div className="lesson-module p-6 bg-white rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Language: Phonics & Sight Words</h2>
      <div className="mb-4">
        <h3 className="font-semibold">Learning Objectives</h3>
        <ul className="list-disc ml-6">
          {objectives.map((obj, idx) => (
            <li key={idx}>{obj}</li>
          ))}
        </ul>
      </div>
      <AlphabetSoundsActivity />
      <SightWordsActivity />
      <SentenceStartersActivity />
      <LanguageChecklist />
      <EasyReadLanguageVisuals />
    </div>
  );
}
