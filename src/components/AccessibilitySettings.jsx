import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  FaCog,
  FaFont,
  FaEye,
  FaVolumeUp,
  FaTasks,
  FaBell,
  FaComment,
  FaBrain,
} from "react-icons/fa";

// Tab content components
const VisualSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Visual Preferences</h3>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Visual Mode</label>
        <select
          value={settings.visualMode}
          onChange={(e) => updateSetting("visualMode", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="standard">Standard</option>
          <option value="high-contrast">High Contrast</option>
          <option value="reduced-colors">Reduced Colors</option>
          <option value="dyslexia-friendly">Dyslexia Friendly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Font Type</label>
        <select
          value={settings.fontType}
          onChange={(e) => updateSetting("fontType", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="default">Default</option>
          <option value="open-dyslexic">OpenDyslexic</option>
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Font Size</label>
        <select
          value={settings.fontSize}
          onChange={(e) => updateSetting("fontSize", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
          <option value="x-large">Extra Large</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Line Spacing</label>
        <select
          value={settings.lineSpacing}
          onChange={(e) => updateSetting("lineSpacing", e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="normal">Normal</option>
          <option value="wide">Wide</option>
          <option value="wider">Wider</option>
        </select>
      </div>
    </div>

    <div className="space-y-2">
      <h4 className="text-lg font-medium">Visual Helpers</h4>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="usePictorialReminders"
          checked={settings.usePictorialReminders}
          onChange={(e) => updateSetting("usePictorialReminders", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="usePictorialReminders">Use pictorial reminders when available</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="useChecklists"
          checked={settings.useChecklists}
          onChange={(e) => updateSetting("useChecklists", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="useChecklists">Show checklists for tasks</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="useFlowcharts"
          checked={settings.useFlowcharts}
          onChange={(e) => updateSetting("useFlowcharts", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="useFlowcharts">Use flowcharts for complex tasks</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="useWrittenInstructions"
          checked={settings.useWrittenInstructions}
          onChange={(e) => updateSetting("useWrittenInstructions", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="useWrittenInstructions">Show written instructions</label>
      </div>
    </div>
  </div>
);

const PreparationSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Preparation Preferences</h3>

    <div className="space-y-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showAdvanceNotice"
          checked={settings.showAdvanceNotice}
          onChange={(e) => updateSetting("showAdvanceNotice", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showAdvanceNotice">Show advance notice of changes</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showLessonPreviews"
          checked={settings.showLessonPreviews}
          onChange={(e) => updateSetting("showLessonPreviews", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showLessonPreviews">Show lesson previews before starting</label>
      </div>
    </div>
  </div>
);

const CommunicationSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Communication Preferences</h3>

    <div>
      <label className="block text-sm font-medium mb-1">Preferred Communication Mode</label>
      <select
        value={settings.preferredCommunicationMode}
        onChange={(e) => updateSetting("preferredCommunicationMode", e.target.value)}
        className="w-full p-2 border rounded-lg"
      >
        <option value="mixed">Mixed (Text, Visual & Audio)</option>
        <option value="text">Text Only</option>
        <option value="visual">Visual (Graphics & Images)</option>
        <option value="audio">Audio</option>
      </select>
    </div>

    <div className="space-y-2 mt-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="extendedProcessingTime"
          checked={settings.extendedProcessingTime}
          onChange={(e) => updateSetting("extendedProcessingTime", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="extendedProcessingTime">Extended processing time for activities</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="simplifiedLanguage"
          checked={settings.simplifiedLanguage}
          onChange={(e) => updateSetting("simplifiedLanguage", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="simplifiedLanguage">
          Use simplified language (avoid idioms, figures of speech)
        </label>
      </div>
    </div>
  </div>
);

const SensorySettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Sensory Preferences</h3>

    <div className="space-y-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="reduceBrightness"
          checked={settings.reduceBrightness}
          onChange={(e) => updateSetting("reduceBrightness", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="reduceBrightness">Reduce brightness and contrast</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="reduceMotion"
          checked={settings.reduceMotion}
          onChange={(e) => updateSetting("reduceMotion", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="reduceMotion">Reduce animations and motion</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="allowAudioControl"
          checked={settings.allowAudioControl}
          onChange={(e) => updateSetting("allowAudioControl", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="allowAudioControl">Show audio controls for all media</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="muteBackground"
          checked={settings.muteBackground}
          onChange={(e) => updateSetting("muteBackground", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="muteBackground">Mute background sounds and music</label>
      </div>
    </div>
  </div>
);

const StructuralSettings = ({ settings, updateSetting }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold mb-4">Organizational Preferences</h3>

    <div className="space-y-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="showProgressIndicators"
          checked={settings.showProgressIndicators}
          onChange={(e) => updateSetting("showProgressIndicators", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showProgressIndicators">Show progress indicators</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="breakDownTasks"
          checked={settings.breakDownTasks}
          onChange={(e) => updateSetting("breakDownTasks", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="breakDownTasks">Break down tasks into smaller steps</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showOneStepAtATime"
          checked={settings.showOneStepAtATime}
          onChange={(e) => updateSetting("showOneStepAtATime", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showOneStepAtATime">Show one step at a time</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="provideTaskChecklists"
          checked={settings.provideTaskChecklists}
          onChange={(e) => updateSetting("provideTaskChecklists", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="provideTaskChecklists">Provide checklists for tasks</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="provideTimelines"
          checked={settings.provideTimelines}
          onChange={(e) => updateSetting("provideTimelines", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="provideTimelines">Show timelines for activities</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showFeedbackImmediately"
          checked={settings.showFeedbackImmediately}
          onChange={(e) => updateSetting("showFeedbackImmediately", e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="showFeedbackImmediately">Show immediate feedback</label>
      </div>
    </div>
  </div>
);

function AccessibilitySettings() {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const [activeTab, setActiveTab] = useState("visual");
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "visual", icon: <FaEye />, label: "Visual" },
    { id: "preparation", icon: <FaBell />, label: "Preparation" },
    { id: "communication", icon: <FaComment />, label: "Communication" },
    { id: "sensory", icon: <FaVolumeUp />, label: "Sensory" },
    { id: "structural", icon: <FaTasks />, label: "Organizational" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "visual":
        return <VisualSettings settings={settings} updateSetting={updateSetting} />;
      case "preparation":
        return <PreparationSettings settings={settings} updateSetting={updateSetting} />;
      case "communication":
        return <CommunicationSettings settings={settings} updateSetting={updateSetting} />;
      case "sensory":
        return <SensorySettings settings={settings} updateSetting={updateSetting} />;
      case "structural":
        return <StructuralSettings settings={settings} updateSetting={updateSetting} />;
      default:
        return <VisualSettings settings={settings} updateSetting={updateSetting} />;
    }
  };

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label="Accessibility Settings"
      >
        <FaCog className="text-xl" />
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center">
                <FaCog className="mr-2" /> Accessibility & Neurodiversity Settings
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Tabs */}
              <div className="bg-gray-100 p-4 md:w-64 flex md:flex-col overflow-x-auto md:overflow-y-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center p-3 mb-2 rounded-lg ${
                      activeTab === tab.id ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                    } transition-all md:w-full`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}

                <div className="mt-auto pt-4 border-t border-gray-300 mt-4">
                  <Link
                    to="/neurodivergent-learning"
                    className="w-full p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 flex items-center justify-center mb-3"
                  >
                    <FaBrain className="mr-2" /> Neurodivergent Learning Settings
                  </Link>
                  <button
                    onClick={resetSettings}
                    className="w-full p-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AccessibilitySettings;
