import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";

function UnauthorizedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-50"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-semibold text-black mb-6 hover:opacity-70 transition-opacity"
          >
            Windgap Academy
          </button>
          <h1 className="text-3xl font-bold text-black mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this resource</p>
        </div>

        {/* Unauthorized Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-red-600 text-3xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">Unauthorized Access</h2>
            <div className="p-4 mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-yellow-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-yellow-700 text-sm font-medium mb-1">Permission Required</p>
                  <p className="text-yellow-700 text-sm">
                    Your current user role does not have the necessary permissions to access this
                    page. If you believe this is an error, please contact an administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate(from !== "/unauthorized" ? from : "/dashboard")}
              className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-50"
            >
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-white text-gray-600 border border-gray-300 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50"
            >
              Return to Home
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <button
              onClick={() => navigate("/contact")}
              className="hover:text-gray-700 transition-colors"
            >
              Contact Support
            </button>
            <button
              onClick={() => navigate("/help")}
              className="hover:text-gray-700 transition-colors"
            >
              Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
