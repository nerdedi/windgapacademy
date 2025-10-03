// Portions of this file were generated with the assistance of GitHub Copilot

import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Microsoft Sign-In Button component
 *
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Button style variant ('default', 'large', 'outline')
 * @param {string} [props.text='Sign in with Microsoft'] - Button text
 * @param {Function} [props.onSuccess] - Callback for successful sign-in
 * @param {Function} [props.onError] - Callback for sign-in errors
 * @param {Object} [props.className] - Additional CSS classes
 */
const MicrosoftSignInButton = ({
  variant = "default",
  text = "Sign in with Microsoft",
  onSuccess,
  onError,
  className = "",
  ...props
}) => {
  const { signInWithMicrosoft } = useAuth();
  const [loading, setLoading] = React.useState(false);

  // Button style variants
  const buttonStyles = {
    default:
      "flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-all",
    large:
      "flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-md text-lg hover:bg-gray-50 transition-all w-full",
    outline:
      "flex items-center justify-center gap-2 px-4 py-2 bg-transparent text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-all",
  };

  // Microsoft logo SVG
  const MicrosoftLogo = () => (
    <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );

  const handleSignIn = async () => {
    setLoading(true);

    try {
      const user = await signInWithMicrosoft();
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(user);
      }
    } catch (error) {
      if (onError && typeof onError === "function") {
        onError(error);
      } else {
        console.error("Microsoft sign-in error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`${buttonStyles[variant] || buttonStyles.default} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-5 h-5 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></span>
      ) : (
        <MicrosoftLogo />
      )}
      {text}
    </button>
  );
};

export default MicrosoftSignInButton;
