import { sendEmailVerification } from "firebase/auth";
import React, { useState } from "react";
import { FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function VerifyEmailPage() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [resendStatus, setResendStatus] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!currentUser) return;

    setIsResending(true);
    setResendStatus("");
    setResendError("");

    try {
      await sendEmailVerification(currentUser);
      setResendStatus("Verification email sent successfully!");
    } catch (error) {
      console.error("Error sending verification email:", error);
      setResendError(error.message || "Failed to send verification email. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-800 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login if not logged in
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-semibold text-black mb-6 hover:opacity-70 transition-opacity"
          >
            Windgap Academy
          </button>
          <h1 className="text-3xl font-bold text-black mb-2">Verify Your Email</h1>
          <p className="text-gray-600">
            We've sent a verification email to{" "}
            <span className="font-semibold">{currentUser.email}</span>
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-blue-600 text-3xl" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check Your Inbox</h2>
            <p className="text-gray-600">
              Please check your email and click on the verification link to complete your
              registration.
            </p>
          </div>

          {/* Status Messages */}
          {resendStatus && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <p className="text-green-700 text-sm font-medium">{resendStatus}</p>
              </div>
            </div>
          )}

          {resendError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
              <div className="flex items-center">
                <FaExclamationCircle className="text-red-500 mr-2" />
                <p className="text-red-700 text-sm font-medium">{resendError}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Resending...</span>
                </div>
              ) : (
                "Resend Verification Email"
              )}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-blue-50"
            >
              Back to Login
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-xs text-gray-500">
            <button className="hover:text-gray-700 transition-colors">Privacy Policy</button>
            <button className="hover:text-gray-700 transition-colors">Terms of Service</button>
            <button className="hover:text-gray-700 transition-colors">Support</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
