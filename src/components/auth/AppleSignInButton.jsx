import { useAuth } from "@contexts/AuthContext";
import { initializeAppleAuth, signInWithApple } from "@utils/appleAuth";
import { useEffect } from "react";

const AppleSignInButton = ({ className, onSuccess, onError }) => {
  const { setUser } = useAuth();

  useEffect(() => {
    // Initialize Apple Sign In when component mounts
    initializeAppleAuth();
  }, []);

  const handleAppleSignIn = async () => {
    try {
      const authData = await signInWithApple();

      // For demo purposes - in production, you would send this to your backend
      // and get a proper user object with roles, etc.
      const userProfile = {
        id: authData.user?.email || "apple-user",
        name: authData.user?.name
          ? `${authData.user.name.firstName || ""} ${authData.user.name.lastName || ""}`.trim()
          : "Apple User",
        email: authData.user?.email || "",
        provider: "apple",
        photoURL: "",
        authToken: authData.token,
      };

      // Update auth context with user data
      setUser(userProfile);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userProfile);
      }
    } catch (error) {
      console.error("Apple Sign In failed:", error);

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handleAppleSignIn}
      className={`flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors ${className || ""}`}
      aria-label="Sign in with Apple"
    >
      {/* Apple logo */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.183 0c.163 1.716-1.133 3.259-2.897 3.925-1.765.666-3.593-.05-4.56-1.269-1.043-1.308-1.988-3.619-1.22-5.856 1.9 0 3.733 1.276 4.76 2.784.787 1.165 1.398 2.816.917 5.416zm7.05 16.864c-.672 1.56-1.66 2.952-2.961 4.171-1.31 1.22-2.134 1.065-3.255.432-1.12-.633-2.24-.633-3.358 0-1.493.845-2.177.787-3.255 0-3.151-2.926-4.166-8.268-2.797-11.898 1.293-2.529 3.074-2.812 4.605-2.087.749.356 1.788.854 2.702.854.914 0 2.088-.498 3.063-.854 1.688-.592 3.255-.05 4.483 1.269-3.921 2.175-3.299 7.842.773 8.113z" />
      </svg>
      Sign in with Apple
    </button>
  );
};

export default AppleSignInButton;
