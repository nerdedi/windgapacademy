import React, { useState } from "react";

import BlenderModelViewer from "./BlenderModelViewer.js";

interface BlenderCharacterGalleryProps {
  characters: {
    id: string;
    name: string;
    modelPath: string;
    thumbnailPath: string;
    description: string;
    animations: {
      id: string;
      label: string;
      clipName: string;
    }[];
  }[];
}

const BlenderCharacterGallery: React.FC<BlenderCharacterGalleryProps> = ({ characters }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [currentAnimation, setCurrentAnimation] = useState(
    selectedCharacter?.animations?.[0]?.id || "idle",
  );

  const handleCharacterSelect = (character: (typeof characters)[0]) => {
    setSelectedCharacter(character);
    // Reset animation to first available or idle
    setCurrentAnimation(character.animations?.[0]?.id || "idle");
  };

  return (
    <div className="blender-character-gallery">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <h3 className="text-xl font-bold mb-4">Windgap Characters</h3>
          <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {characters.map((character) => (
              <div
                key={character.id}
                className={`character-card p-3 rounded cursor-pointer transition-all ${
                  selectedCharacter.id === character.id
                    ? "bg-blue-100 border-blue-500 border-2"
                    : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
                }`}
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={character.thumbnailPath}
                    alt={character.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-bold">{character.name}</h4>
                    <p className="text-sm text-gray-600">
                      {character.animations.length} animations
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          {selectedCharacter && (
            <div className="character-preview">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedCharacter.name}</h3>
                <div className="animation-controls">
                  <select
                    value={currentAnimation}
                    onChange={(e) => setCurrentAnimation(e.target.value)}
                    className="p-2 border rounded"
                  >
                    {selectedCharacter.animations.map((anim) => (
                      <option key={anim.id} value={anim.id}>
                        {anim.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 border rounded overflow-hidden shadow-lg">
                <BlenderModelViewer
                  modelPath={selectedCharacter.modelPath}
                  isCharacter={true}
                  width="100%"
                  height="500px"
                  backgroundColor="#f8f9fa"
                  initialAnimation={currentAnimation}
                  availableAnimations={selectedCharacter.animations}
                  autoRotate={false}
                />
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-lg mb-2">About this character</h4>
                <p className="text-gray-700">{selectedCharacter.description}</p>

                <div className="mt-4">
                  <h4 className="font-bold text-lg mb-2">Animations</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {selectedCharacter.animations.map((anim) => (
                      <button
                        key={anim.id}
                        className={`p-2 text-sm border rounded transition-colors ${
                          currentAnimation === anim.id
                            ? "bg-blue-500 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentAnimation(anim.id)}
                      >
                        {anim.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlenderCharacterGallery;
