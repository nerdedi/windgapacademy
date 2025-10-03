// Portions of this file were generated with the assistance of GitHub Copilot

import { useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import MicrosoftSignInButton from "./MicrosoftSignInButton";

/**
 * OAuth Login component that provides multiple sign-in options
 *
 * @param {Object} props - Component props
 * @param {Function} [props.onSuccess] - Callback for successful sign-in
 * @param {Function} [props.onError] - Callback for sign-in errors
 * @param {string} [props.redirectUrl] - URL to redirect after successful login
 * @param {Array<string>} [props.providers] - List of providers to display ('google', 'microsoft', 'apple', 'facebook')
 * @param {string} [props.layout] - Layout style ('vertical', 'horizontal', 'grid')
 * @param {Object} [props.className] - Additional CSS classes
 */
const OAuthSignIn = ({
  onSuccess,
  onError,
  redirectUrl,
  providers = ["google", "microsoft", "apple", "facebook"],
  layout = "vertical",
  className = "",
}) => {
  const { signInWithGoogle, signInWithMicrosoft, signInWithApple, signInWithFacebook } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Container layout styles
  const containerStyles = {
    vertical: "flex flex-col gap-3 w-full",
    horizontal: "flex flex-row gap-3 w-full",
    grid: "grid grid-cols-2 gap-3 w-full",
  };

  // Handle provider sign-in
  const handleProviderSignIn = async (provider) => {
    setLoading(true);
    setError(null);

    try {
      let user;

      switch (provider) {
        case "google":
          user = await signInWithGoogle();
          break;
        case "microsoft":
          user = await signInWithMicrosoft();
          break;
        case "apple":
          user = await signInWithApple();
          break;
        case "facebook":
          user = await signInWithFacebook();
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Handle redirect if URL provided
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      // Call success callback if provided
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(user);
      }
    } catch (err) {
      setError(err.message);

      if (onError && typeof onError === "function") {
        onError(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Google logo SVG
  const GoogleLogo = () => (
    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );

  // Apple logo SVG
  const AppleLogo = () => (
    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path
        fill="currentColor"
        d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
      />
    </svg>
  );

  // Facebook logo SVG
  const FacebookLogo = () => (
    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
      <path
        fill="#1877F2"
        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
      />
    </svg>
  );

  return (
    <div className={`${containerStyles[layout] || containerStyles.vertical} ${className}`}>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-3">{error}</div>}

      {providers.includes("google") && (
        <button
          onClick={() => handleProviderSignIn("google")}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-all w-full"
        >
          <GoogleLogo />
          Sign in with Google
        </button>
      )}

      {providers.includes("microsoft") && (
        <MicrosoftSignInButton
          variant="large"
          disabled={loading}
          onSuccess={(user) => {
            if (onSuccess) onSuccess(user);
            if (redirectUrl) window.location.href = redirectUrl;
          }}
          onError={(err) => {
            setError(err.message);
            if (onError) onError(err);
          }}
        />
      )}

      {providers.includes("apple") && (
        <button
          onClick={() => handleProviderSignIn("apple")}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white border border-black rounded-md hover:bg-gray-900 transition-all w-full"
        >
          <AppleLogo />
          Sign in with Apple
        </button>
      )}

      {providers.includes("facebook") && (
        <button
          onClick={() => handleProviderSignIn("facebook")}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-all w-full"
        >
          <FacebookLogo />
          Sign in with Facebook
        </button>
      )}

      {loading && (
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OAuthSignIn;
