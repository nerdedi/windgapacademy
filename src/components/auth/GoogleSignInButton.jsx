import React, { useEffect } from "react";
import { initializeGoogleAuth, signInWithGoogle } from "@utils/googleAuth";
import { useAuth } from "@contexts/AuthContext";

const GoogleSignInButton = ({ className, onSuccess, onError }) => {
  const { setUser } = useAuth();

  useEffect(() => {
    // Initialize Google Sign In when component mounts
    initializeGoogleAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const authData = await signInWithGoogle();

      // For demo purposes - in production, you would send this to your backend
      // and get a proper user object with roles, etc.
      const userProfile = {
        id: authData.user?.email || "google-user",
        name: authData.user?.name || "Google User",
        email: authData.user?.email || "",
        provider: "google",
        photoURL: authData.user?.picture || "",
        authToken: authData.token,
      };

      // Update auth context with user data
      setUser(userProfile);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userProfile);
      }
    } catch (error) {
      console.error("Google Sign In failed:", error);

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className={`flex items-center justify-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors ${className || ""}`}
      aria-label="Sign in with Google"
    >
      {/* Google logo - replace with appropriate icon */}
      <span className="w-5 h-5 flex items-center justify-center">Google</span>
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
