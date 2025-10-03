// Portions of this file were generated with the assistance of GitHub Copilot

import PropTypes from "prop-types";
import { useState } from "react";
import AppleSignInButton from "./AppleSignInButton";
import GoogleSignInButton from "./GoogleSignInButton";
import MicrosoftSignInButton from "./MicrosoftSignInButton";

/**
 * OAuth SignIn component that provides multiple sign-in options
 *
 * @param {Object} props - Component props
 * @param {Function} [props.onSuccess] - Callback for successful sign-in
 * @param {Function} [props.onError] - Callback for sign-in errors
 * @param {string} [props.redirectUrl] - URL to redirect after successful login
 * @param {Array<string>} [props.providers] - List of providers to display ('google', 'microsoft', 'apple')
 * @param {string} [props.layout] - Layout style ('vertical', 'horizontal', 'grid')
 * @param {string} [props.className] - Additional CSS classes
 */
const OAuthSignIn = ({
  onSuccess,
  onError,
  redirectUrl,
  providers = ["google", "microsoft", "apple"],
  layout = "vertical",
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Container layout styles
  const containerStyles = {
    vertical: "flex flex-col gap-3 w-full",
    horizontal: "flex flex-row gap-3 w-full justify-center",
    grid: "grid grid-cols-2 gap-3 w-full",
  };

  // Success handler
  const handleSuccess = (user) => {
    setLoading(false);

    // Handle redirect if URL provided
    if (redirectUrl) {
      window.location.href = redirectUrl;
      return;
    }

    // Call success callback if provided
    if (onSuccess && typeof onSuccess === "function") {
      onSuccess(user);
    }
  };

  // Error handler
  const handleError = (err) => {
    setLoading(false);
    setError(err.message || "Authentication failed");

    if (onError && typeof onError === "function") {
      onError(err);
    }
  };

  return (
    <div className={`${containerStyles[layout] || containerStyles.vertical} ${className}`}>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-3">{error}</div>}

      {providers.includes("google") && (
        <GoogleSignInButton
          className={layout === "horizontal" ? "min-w-[200px]" : "w-full"}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {providers.includes("microsoft") && (
        <MicrosoftSignInButton
          variant={layout === "horizontal" ? "default" : "large"}
          className={layout === "horizontal" ? "min-w-[200px]" : ""}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {providers.includes("apple") && (
        <AppleSignInButton
          className={layout === "horizontal" ? "min-w-[200px]" : "w-full"}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      {loading && (
        <div className="flex justify-center mt-3">
          <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

OAuthSignIn.propTypes = {
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
  redirectUrl: PropTypes.string,
  providers: PropTypes.arrayOf(PropTypes.oneOf(["google", "microsoft", "apple"])),
  layout: PropTypes.oneOf(["vertical", "horizontal", "grid"]),
  className: PropTypes.string,
};

export default OAuthSignIn;
