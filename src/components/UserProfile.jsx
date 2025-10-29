/**
 * User Profile Component
 *
 * This component displays and allows editing of the user's profile information.
 * It includes personal details, accessibility preferences, and privacy settings.
 */

import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";
import { validateUserProfile } from "../utils/userSchema";

const UserProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    displayName: "",
    photoURL: "",
    profile: {
      firstName: "",
      lastName: "",
      bio: "",
      pronouns: "",
      phoneNumber: "",
    },
    settings: {
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
        reduceMotion: false,
      },
      privacy: {
        shareProgressWithEducators: true,
        shareActivityWithGuardians: false,
        allowCommunityFeatures: true,
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personal");

  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
        profile: {
          firstName: currentUser.profile?.firstName || "",
          lastName: currentUser.profile?.lastName || "",
          bio: currentUser.profile?.bio || "",
          pronouns: currentUser.profile?.pronouns || "",
          phoneNumber: currentUser.profile?.phoneNumber || "",
        },
        settings: {
          accessibility: {
            highContrast: currentUser.settings?.accessibility?.highContrast || false,
            largeText: currentUser.settings?.accessibility?.largeText || false,
            screenReader: currentUser.settings?.accessibility?.screenReader || false,
            reduceMotion: currentUser.settings?.accessibility?.reduceMotion || false,
          },
          privacy: {
            shareProgressWithEducators:
              currentUser.settings?.privacy?.shareProgressWithEducators !== false,
            shareActivityWithGuardians:
              currentUser.settings?.privacy?.shareActivityWithGuardians || false,
            allowCommunityFeatures: currentUser.settings?.privacy?.allowCommunityFeatures !== false,
          },
        },
      });
    }
  }, [currentUser]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes(".")) {
      // Handle nested properties (e.g., profile.firstName)
      const [section, field] = name.split(".");
      setProfileData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.includes("accessibility.") || name.includes("privacy.")) {
      // Handle deeply nested properties (e.g., settings.accessibility.highContrast)
      const [section, subsection, field] = name.split(".");
      setProfileData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...prev[section][subsection],
            [field]: type === "checkbox" ? checked : value,
          },
        },
      }));
    } else {
      // Handle top-level properties
      setProfileData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate profile data
      const validation = validateUserProfile(profileData.profile);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        setLoading(false);
        return;
      }

      // Update display name if it has changed
      let updatedDisplayName = profileData.displayName;
      if (!updatedDisplayName && (profileData.profile.firstName || profileData.profile.lastName)) {
        updatedDisplayName =
          `${profileData.profile.firstName} ${profileData.profile.lastName}`.trim();
      }

      // Update profile in Firebase
      await updateProfile({
        displayName: updatedDisplayName,
        photoURL: profileData.photoURL,
        profile: profileData.profile,
        settings: profileData.settings,
      });

      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(`Error updating profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab("personal")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "personal"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab("accessibility")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "accessibility"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Accessibility
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "privacy"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Privacy
          </button>
        </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {profileData.photoURL ? (
                  <img
                    src={profileData.photoURL}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">
                    {profileData.profile.firstName.charAt(0) ||
                      profileData.displayName.charAt(0) ||
                      "U"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
                <input
                  type="url"
                  name="photoURL"
                  value={profileData.photoURL}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="mt-1 text-xs text-gray-500">Enter a URL for your profile photo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="profile.firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="profile.firstName"
                  name="profile.firstName"
                  value={profileData.profile.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="profile.lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="profile.lastName"
                  name="profile.lastName"
                  value={profileData.profile.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile.pronouns" className="block text-sm font-medium text-gray-700">
                Pronouns
              </label>
              <input
                type="text"
                id="profile.pronouns"
                name="profile.pronouns"
                value={profileData.profile.pronouns}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., she/her, they/them"
              />
            </div>

            <div>
              <label
                htmlFor="profile.phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="profile.phoneNumber"
                name="profile.phoneNumber"
                value={profileData.profile.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="profile.bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="profile.bio"
                name="profile.bio"
                rows="3"
                value={profileData.profile.bio}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tell us a bit about yourself"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                {profileData.profile.bio.length}/500 characters
              </p>
            </div>
          </div>
        )}

        {/* Accessibility Tab */}
        {activeTab === "accessibility" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Display Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.accessibility.highContrast"
                      name="settings.accessibility.highContrast"
                      type="checkbox"
                      checked={profileData.settings.accessibility.highContrast}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.accessibility.highContrast"
                      className="font-medium text-gray-700"
                    >
                      High Contrast Mode
                    </label>
                    <p className="text-gray-500">
                      Increases contrast between text and background colors
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.accessibility.largeText"
                      name="settings.accessibility.largeText"
                      type="checkbox"
                      checked={profileData.settings.accessibility.largeText}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.accessibility.largeText"
                      className="font-medium text-gray-700"
                    >
                      Large Text
                    </label>
                    <p className="text-gray-500">
                      Increases the size of text throughout the application
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.accessibility.screenReader"
                      name="settings.accessibility.screenReader"
                      type="checkbox"
                      checked={profileData.settings.accessibility.screenReader}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.accessibility.screenReader"
                      className="font-medium text-gray-700"
                    >
                      Screen Reader Optimization
                    </label>
                    <p className="text-gray-500">Optimizes the interface for screen readers</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.accessibility.reduceMotion"
                      name="settings.accessibility.reduceMotion"
                      type="checkbox"
                      checked={profileData.settings.accessibility.reduceMotion}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.accessibility.reduceMotion"
                      className="font-medium text-gray-700"
                    >
                      Reduce Motion
                    </label>
                    <p className="text-gray-500">Minimizes animations and transitions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.privacy.shareProgressWithEducators"
                      name="settings.privacy.shareProgressWithEducators"
                      type="checkbox"
                      checked={profileData.settings.privacy.shareProgressWithEducators}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.privacy.shareProgressWithEducators"
                      className="font-medium text-gray-700"
                    >
                      Share Progress with Educators
                    </label>
                    <p className="text-gray-500">
                      Allow educators to view your learning progress and achievements
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.privacy.shareActivityWithGuardians"
                      name="settings.privacy.shareActivityWithGuardians"
                      type="checkbox"
                      checked={profileData.settings.privacy.shareActivityWithGuardians}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.privacy.shareActivityWithGuardians"
                      className="font-medium text-gray-700"
                    >
                      Share Activity with Family Members/Guardians
                    </label>
                    <p className="text-gray-500">
                      Allow family members or guardians to view your activity and progress
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="settings.privacy.allowCommunityFeatures"
                      name="settings.privacy.allowCommunityFeatures"
                      type="checkbox"
                      checked={profileData.settings.privacy.allowCommunityFeatures}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="settings.privacy.allowCommunityFeatures"
                      className="font-medium text-gray-700"
                    >
                      Enable Community Features
                    </label>
                    <p className="text-gray-500">
                      Participate in community activities, forums, and collaborative learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
