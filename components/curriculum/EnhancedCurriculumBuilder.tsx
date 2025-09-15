// This is a simplified version of the CurriculumBuilderWithBlender
// that doesn't depend on Chakra UI and has proper TypeScript typing

import React, { useState } from "react";
import BlenderModelViewer from "../../src/components/BlenderModelViewer";

// Define types for our characters and animations
interface Animation {
  id: string;
  label: string;
  clipName: string;
}

interface Character {
  id: string;
  name: string;
  path: string;
  animations: Animation[];
  subjects: string[];
}

// Character definitions for curriculum
const curriculumCharacters: Character[] = [
  {
    id: "winnie",
    name: "Winnie",
    path: "/assets/characters/winnie/winnie.glb",
    animations: [
      { id: "idle", label: "Idle", clipName: "idle" },
      { id: "teaching", label: "Teaching", clipName: "teaching" },
      { id: "encourage", label: "Encourage", clipName: "encourage" },
      { id: "celebrate", label: "Celebrate", clipName: "celebrate" },
    ],
    subjects: ["Life Skills", "Digital Literacy"],
  },
  {
    id: "natalie",
    name: "Natalie",
    path: "/assets/characters/natalie/natalie.glb",
    animations: [
      { id: "idle", label: "Idle", clipName: "idle" },
      { id: "teaching", label: "Teaching", clipName: "teaching" },
    ],
    subjects: ["Employment Skills", "Digital Literacy"],
  },
];

// Module templates
const moduleTemplates: Record<string, string[]> = {
  "Life Skills": [
    "Daily Living Skills",
    "Social Skills",
    "Self-Care and Health",
    "Community Navigation",
    "Personal Finance",
  ],
  "Employment Skills": [
    "Resume Building",
    "Interview Skills",
    "Workplace Communication",
    "Time Management",
    "Career Exploration",
  ],
  "Digital Literacy": [
    "Computer Basics",
    "Internet Safety",
    "Using Email",
    "Social Media Awareness",
    "Office Applications",
  ],
};

export default function EnhancedCurriculumBuilder(): JSX.Element {
  const [selectedSubject, setSelectedSubject] = useState<string>("Life Skills");
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(curriculumCharacters[0]);
  const [selectedAnimation, setSelectedAnimation] = useState<string>("idle");
  const [showCharacterPreview, setShowCharacterPreview] = useState<boolean>(false);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [moduleContent, setModuleContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Filter characters by selected subject
  const filteredCharacters = curriculumCharacters.filter((character) =>
    character.subjects.includes(selectedSubject),
  );

  // Auto-generate a module based on selected subject
  const generateModule = () => {
    setIsGenerating(true);

    // Simulate module generation (in real app, this would call an API)
    setTimeout(() => {
      const templates = moduleTemplates[selectedSubject] || [];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

      setModuleTitle(`${randomTemplate} Module`);
      setModuleContent(
        `This is an automatically generated curriculum module for ${selectedSubject}, focusing on ${randomTemplate}.\n\nIt features ${selectedCharacter.name} as the instructor character.\n\nThe character will use the "${selectedAnimation}" animation during key teaching moments.`,
      );

      setShowCharacterPreview(true);
      setIsGenerating(false);

      // Play the teaching animation
      if (selectedCharacter.animations.find((anim) => anim.id === "teaching")) {
        setSelectedAnimation("teaching");
      }

      alert(`Created a new ${randomTemplate} module with ${selectedCharacter.name}`);
    }, 1500);
  };

  return (
    <div className="curriculum-builder p-5">
      <h2 className="text-2xl font-bold mb-6">Enhanced Curriculum Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="subject" className="block mb-2">
              Subject
            </label>
            <select
              id="subject"
              className="select w-full p-2 border rounded"
              value={selectedSubject}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const newSubject = e.target.value;
                setSelectedSubject(newSubject);
                // Reset character if current one doesn't support this subject
                const validCharacters = curriculumCharacters.filter((char) =>
                  char.subjects.includes(newSubject),
                );
                if (
                  validCharacters.length > 0 &&
                  !validCharacters.find((c) => c.id === selectedCharacter.id)
                ) {
                  setSelectedCharacter(validCharacters[0]);
                }
              }}
            >
              <option value="Life Skills">Life Skills</option>
              <option value="Employment Skills">Employment Skills</option>
              <option value="Digital Literacy">Digital Literacy</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="character" className="block mb-2">
              Character
            </label>
            <select
              id="character"
              className="select w-full p-2 border rounded"
              value={selectedCharacter.id}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const character = curriculumCharacters.find((c) => c.id === e.target.value);
                if (character) {
                  setSelectedCharacter(character);
                  setSelectedAnimation("idle"); // Reset to idle animation
                }
              }}
            >
              {filteredCharacters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={generateModule}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Auto-generate Module"}
          </button>

          {moduleTitle && (
            <>
              <hr className="my-4" />

              <div className="form-group">
                <label htmlFor="moduleTitle" className="block mb-2">
                  Module Title
                </label>
                <input
                  id="moduleTitle"
                  type="text"
                  className="input w-full p-2 border rounded"
                  value={moduleTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setModuleTitle(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="moduleContent" className="block mb-2">
                  Module Content
                </label>
                <textarea
                  id="moduleContent"
                  className="textarea w-full p-2 border rounded"
                  value={moduleContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setModuleContent(e.target.value)
                  }
                  rows={10}
                />
              </div>

              <div className="flex space-x-2">
                <button className="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                  Save Module
                </button>
                <button className="btn border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded">
                  Preview Full Module
                </button>
              </div>
            </>
          )}
        </div>

        {showCharacterPreview && (
          <div className="border rounded overflow-hidden">
            <div className="bg-gray-100 p-4 font-bold">
              Character Preview: {selectedCharacter.name}
            </div>

            <BlenderModelViewer
              modelPath={selectedCharacter.path}
              isCharacter={true}
              width="100%"
              height="400px"
              backgroundColor="#f9fafb"
              initialAnimation={selectedAnimation}
              availableAnimations={selectedCharacter.animations}
              showControls={true}
              autoRotate={false}
              scale={1}
            />

            <div className="p-4">
              <div className="form-group">
                <label htmlFor="animation" className="block mb-2 text-sm">
                  Animation
                </label>
                <select
                  id="animation"
                  className="select w-full p-1 border rounded text-sm"
                  value={selectedAnimation}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedAnimation(e.target.value)
                  }
                >
                  {selectedCharacter.animations.map((anim) => (
                    <option key={anim.id} value={anim.id}>
                      {anim.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
