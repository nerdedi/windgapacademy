import AppleSignInButton from "@components/auth/AppleSignInButton";
import GoogleSignInButton from "@components/auth/GoogleSignInButton"; // Assuming this exists
import MicrosoftSignInButton from "@components/auth/MicrosoftSignInButton"; // Assuming this exists
import { useAuth } from "@contexts/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";

const OAuthLoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleAuthSuccess = (userProfile) => {
    console.log("Authentication successful", userProfile);
    navigate("/dashboard");
  };

  const handleAuthError = (error) => {
    console.error("Authentication failed", error);
    // You could show an error message here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/windgap-logo.png"
            alt="Windgap Academy"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 space-y-4">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <GoogleSignInButton
              className="w-full"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
            <MicrosoftSignInButton
              className="w-full"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
            <AppleSignInButton
              className="w-full"
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          </div>

          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuthLoginPage;
