// Portions of this file were generated with the assistance of GitHub Copilot

import { useEffect, useState } from "react";
import OAuthSignIn from "../components/OAuthSignIn";
import { useAuth } from "../src/context/AuthContext";

/**
 * Login Page Component
 * Demonstrates the use of OAuth authentication in Windgap Academy
 */
const LoginPage = () => {
  const { currentUser, loading, error: authError } = useAuth();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUserProfile({
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        roles: currentUser.roles || [],
        authProviders: Object.keys(currentUser.providerData || {}).map(
          (provider) => provider.providerId,
        ),
      });
      setLoginSuccess(true);
    }
  }, [currentUser]);

  const handleLoginSuccess = (user) => {
    setLoginSuccess(true);
    setLoginError(null);
    console.log("Login successful:", user);

    setUserProfile({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      roles: user.roles || [],
      authProviders: user.providerData.map((provider) => provider.providerId),
    });
  };

  const handleLoginError = (error) => {
    setLoginError(error.message);
    setLoginSuccess(false);
    console.error("Login error:", error);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-12 w-auto" src="/assets/windgap-logo.png" alt="Windgap Academy" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {loading ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {loginSuccess && userProfile ? (
                <div className="bg-green-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Login Successful!</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <div className="flex items-center mb-2">
                          {userProfile.photoURL && (
                            <img
                              src={userProfile.photoURL}
                              alt={userProfile.displayName}
                              className="h-10 w-10 rounded-full mr-3"
                            />
                          )}
                          <p>
                            <strong>{userProfile.displayName}</strong>
                          </p>
                        </div>
                        <p>Email: {userProfile.email}</p>
                        <p>UID: {userProfile.uid.substring(0, 8)}...</p>
                        <p>Roles: {userProfile.roles.join(", ") || "No roles assigned"}</p>
                        <p>Auth Providers: {userProfile.authProviders.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setLoginSuccess(false)}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign in with another account
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {(authError || loginError) && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4 text-sm">
                      {authError || loginError}
                    </div>
                  )}

                  <div className="space-y-6">
                    <OAuthSignIn
                      onSuccess={handleLoginSuccess}
                      onError={handleLoginError}
                      providers={["google", "microsoft", "apple", "facebook"]}
                    />

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or continue with email</span>
                      </div>
                    </div>

                    <div>
                      <a
                        href="#email-login"
                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Use email & password
                      </a>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
