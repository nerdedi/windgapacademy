import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    photoURL: user?.photoURL || "",
  });
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate("/login");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdateError("");
    setUpdateSuccess("");
    setIsSubmitting(true);

    try {
      // Don't allow changing email for OAuth users
      const isOAuthUser = user?.provider !== "password";
      const dataToUpdate = {
        ...profileData,
        email: isOAuthUser ? user.email : profileData.email,
      };

      const result = await updateProfile(dataToUpdate);

      if (result.success) {
        setUpdateSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setUpdateError(result.error?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setUpdateError(error.message || "An error occurred while updating your profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    // Reset form data and exit edit mode
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
    setUpdateError("");
    setUpdateSuccess("");
  };

  const getProviderIcon = (providerName) => {
    switch (providerName) {
      case "apple.com":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M16.183 0c.163 1.716-1.133 3.259-2.897 3.925-1.765.666-3.593-.05-4.56-1.269-1.043-1.308-1.988-3.619-1.22-5.856 1.9 0 3.733 1.276 4.76 2.784.787 1.165 1.398 2.816.917 5.416zm7.05 16.864c-.672 1.56-1.66 2.952-2.961 4.171-1.31 1.22-2.134 1.065-3.255.432-1.12-.633-2.24-.633-3.358 0-1.493.845-2.177.787-3.255 0-3.151-2.926-4.166-8.268-2.797-11.898 1.293-2.529 3.074-2.812 4.605-2.087.749.356 1.788.854 2.702.854.914 0 2.088-.498 3.063-.854 1.688-.592 3.255-.05 4.483 1.269-3.921 2.175-3.299 7.842.773 8.113z" />
          </svg>
        );
      case "google.com":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              fill="currentColor"
            />
          </svg>
        );
      case "microsoft.com":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
            <rect x="1" y="1" width="10" height="10" fill="#f25022" />
            <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
            <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
            <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
          </svg>
        );
      case "password":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Not Signed In</h2>
          <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-blue-300 flex items-center justify-center border-4 border-white">
                  <span className="text-3xl font-bold text-blue-800">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-blue-100">{user.email}</p>
              <div className="mt-2 flex items-center justify-center md:justify-start">
                <span className="flex items-center bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-sm">
                  {getProviderIcon(user.provider)}
                  <span className="ml-2 capitalize">{user.provider.replace(".com", "")}</span>
                </span>
                {user.role && (
                  <span className="ml-2 bg-blue-700 bg-opacity-50 px-3 py-1 rounded-full text-sm capitalize">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-auto mt-4 md:mt-0">
              <button
                onClick={handleSignOut}
                className="bg-transparent hover:bg-blue-700 text-white font-medium py-2 px-4 border border-white rounded transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {updateError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{updateError}</p>
                </div>
              </div>
            </div>
          )}

          {updateSuccess && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{updateSuccess}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit Profile
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        user.provider !== "password" ? "bg-gray-100" : ""
                      }`}
                      required
                      disabled={user.provider !== "password"}
                    />
                    {user.provider !== "password" && (
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed for accounts linked with {user.provider}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      id="photoURL"
                      value={profileData.photoURL}
                      onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p>{user.email}</p>
                    {user.emailVerified && (
                      <span className="inline-flex items-center mt-1 text-xs text-green-800 bg-green-100 px-2 py-0.5 rounded">
                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                    <p>{new Date(user.lastLogin).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional sections like account preferences, linked accounts, etc. can go here */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
