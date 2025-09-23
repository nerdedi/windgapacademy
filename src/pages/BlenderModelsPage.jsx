import { motion } from "framer-motion";
import { useState } from "react";

import BlenderModelViewer from "../components/BlenderModelViewer";
import "../styles/BlenderModelsPage.css";

/**
 * BlenderModelsPage Component
 *
 * This page demonstrates the integration of Blender models with
 * Windgap Academy's WebGL utilities.
 */
const BlenderModelsPage = () => {
  const [selectedModel, setSelectedModel] = useState("winnie");
  const [showSettings, setShowSettings] = useState(false);
  const [viewerSettings, setViewerSettings] = useState({
    autoRotate: true,
    showControls: true,
    showEffects: true,
    scale: 1,
    backgroundColor: "#1a1a2e",
  });

  // Available character models
  const characterModels = [
    {
      id: "winnie",
      name: "Winnie",
      path: "/assets/characters/winnie/winnie.glb",
      thumbnail: "/assets/images/winnie-thumbnail.jpg",
      description: "Main mascot character with friendly design",
      animations: [
        { id: "idle", label: "Idle", clipName: "idle" },
        { id: "teaching", label: "Teaching", clipName: "teaching" },
        { id: "encourage", label: "Encourage", clipName: "encourage" },
        { id: "celebrate", label: "Celebrate", clipName: "celebrate" },
        { id: "wave", label: "Wave", clipName: "wave" },
        { id: "walk", label: "Walk", clipName: "walk" },
      ],
    },
    {
      id: "natalie",
      name: "Natalie",
      path: "/assets/characters/natalie/natalie.glb",
      thumbnail: "/assets/images/natalie-thumbnail.jpg",
      description: "Teacher character with professional appearance",
      animations: [
        { id: "idle", label: "Idle", clipName: "idle" },
        { id: "teaching", label: "Teaching", clipName: "teaching" },
        { id: "encourage", label: "Encourage", clipName: "encourage" },
        { id: "celebrate", label: "Celebrate", clipName: "celebrate" },
      ],
    },
    {
      id: "daisy",
      name: "Daisy",
      path: "/assets/characters/daisy/daisy.glb",
      thumbnail: "/assets/images/daisy-thumbnail.jpg",
      description: "Student character with energetic personality",
      animations: [
        { id: "idle", label: "Idle", clipName: "idle" },
        { id: "wave", label: "Wave", clipName: "wave" },
        { id: "walk", label: "Walk", clipName: "walk" },
      ],
    },
  ];

  // Available environment models
  const environmentModels = [
    {
      id: "classroom",
      name: "Classroom",
      path: "/assets/environments/classroom/classroom.glb",
      thumbnail: "/assets/images/classroom-thumbnail.jpg",
      description: "Standard classroom environment with desks and learning materials",
      isCharacter: false,
    },
    {
      id: "playground",
      name: "Playground",
      path: "/assets/environments/playground/playground.glb",
      thumbnail: "/assets/images/playground-thumbnail.jpg",
      description: "Outdoor playground with fun equipment",
      isCharacter: false,
    },
  ];

  // Find the currently selected model data
  const getSelectedModelData = () => {
    return [...characterModels, ...environmentModels].find((model) => model.id === selectedModel);
  };

  // Handle settings change
  const updateSettings = (key, value) => {
    setViewerSettings({
      ...viewerSettings,
      [key]: value,
    });
  };

  const selectedModelData = getSelectedModelData();

  return (
    <div className="blender-models-page">
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Blender Models Integration</h1>
        <p>
          Demonstrating the integration of Blender-created models with Windgap Academy&apos;s WebGL
          utilities
        </p>
      </motion.div>

      <div className="page-content">
        <div className="model-selector">
          <h2>Characters</h2>
          <div className="model-thumbnails">
            {characterModels.map((model) => (
              <div
                key={model.id}
                className={`model-thumbnail ${selectedModel === model.id ? "active" : ""}`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="thumbnail-image">
                  <img src={model.thumbnail} alt={model.name} />
                </div>
                <div className="thumbnail-label">{model.name}</div>
              </div>
            ))}
          </div>

          <h2>Environments</h2>
          <div className="model-thumbnails">
            {environmentModels.map((model) => (
              <div
                key={model.id}
                className={`model-thumbnail ${selectedModel === model.id ? "active" : ""}`}
                onClick={() => setSelectedModel(model.id)}
              >
                <div className="thumbnail-image">
                  <img src={model.thumbnail} alt={model.name} />
                </div>
                <div className="thumbnail-label">{model.name}</div>
              </div>
            ))}
          </div>

          <div className="viewer-settings">
            <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? "Hide Settings" : "Show Settings"}
            </button>

            {showSettings && (
              <div className="settings-panel">
                <div className="setting-item">
                  <label>Auto Rotate</label>
                  <input
                    type="checkbox"
                    checked={viewerSettings.autoRotate}
                    onChange={(e) => updateSettings("autoRotate", e.target.checked)}
                  />
                </div>

                <div className="setting-item">
                  <label>Show Controls</label>
                  <input
                    type="checkbox"
                    checked={viewerSettings.showControls}
                    onChange={(e) => updateSettings("showControls", e.target.checked)}
                  />
                </div>

                <div className="setting-item">
                  <label>Show Effects</label>
                  <input
                    type="checkbox"
                    checked={viewerSettings.showEffects}
                    onChange={(e) => updateSettings("showEffects", e.target.checked)}
                  />
                </div>

                <div className="setting-item">
                  <label>Scale</label>
                  <input
                    type="range"
                    min="0.1"
                    max="2"
                    step="0.1"
                    value={viewerSettings.scale}
                    onChange={(e) => updateSettings("scale", parseFloat(e.target.value))}
                  />
                  <span>{viewerSettings.scale.toFixed(1)}</span>
                </div>

                <div className="setting-item">
                  <label>Background</label>
                  <input
                    type="color"
                    value={viewerSettings.backgroundColor}
                    onChange={(e) => updateSettings("backgroundColor", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="model-viewer-container">
          {selectedModelData && (
            <>
              <div className="model-info">
                <h2>{selectedModelData.name}</h2>
                <p>{selectedModelData.description}</p>
              </div>

              <BlenderModelViewer
                modelPath={selectedModelData.path}
                isCharacter={selectedModelData.isCharacter !== false}
                width="100%"
                height="500px"
                backgroundColor={viewerSettings.backgroundColor}
                initialAnimation={selectedModelData.animations?.[0]?.id || "idle"}
                availableAnimations={selectedModelData.animations || []}
                showControls={viewerSettings.showControls}
                showEffects={viewerSettings.showEffects}
                autoRotate={viewerSettings.autoRotate}
                scale={viewerSettings.scale}
                onLoaded={() => console.log(`Model ${selectedModelData.name} loaded successfully`)}
                onError={(err) =>
                  console.error(`Error loading model ${selectedModelData.name}:`, err)
                }
              />

              <div className="integration-code">
                <h3>Integration Code Example</h3>
                <pre>
                  <code>{`
// Import the BlenderModelLoader
import BlenderModelLoader from '../utils/BlenderModelLoader';
import WebGLEffectsUtil from '../utils/WebGLEffects';

// Create the loader
const modelLoader = new BlenderModelLoader();

// Load a character model
modelLoader.loadModel('${selectedModelData.path}', {
  name: '${selectedModelData.id}',
  scale: ${viewerSettings.scale},
  isCharacter: ${selectedModelData.isCharacter !== false},
  animations: {
    ${
      selectedModelData.animations
        ? selectedModelData.animations
            .map((anim) => `${anim.id}: '${anim.clipName || anim.id}'`)
            .join(",\n    ")
        : "// No animations available for this model"
    }
  }
})
.then(model => {
  // Add model to scene
  scene.add(model.scene);

  // Play an animation if available
  ${
    selectedModelData.animations && selectedModelData.animations.length > 0
      ? `modelLoader.playAnimation('${selectedModelData.id}', '${selectedModelData.animations[0].id}');`
      : "// No animations to play"
  }

  // Apply effects
  modelLoader.applyEffect('${selectedModelData.id}', 'glow', {
    color: '#6366f1',
    intensity: 0.5,
    pulseSpeed: 2,
    duration: 3
  });
});
                  `}</code>
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlenderModelsPage;
