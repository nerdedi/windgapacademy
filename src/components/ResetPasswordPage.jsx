import React, { useState } from "react";
import { FaLock, FaEnvelope, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.message || "Failed to send password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-black mb-2">Reset Your Password</h1>
          <p className="text-gray-600">
            {resetSent
              ? "Check your email for password reset instructions"
              : "Enter your email to receive password reset instructions"}
          </p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {resetSent ? (
            // Success state
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h2 className="text-xl font-bold mb-2">Email Sent</h2>
              <p className="text-gray-600 mb-8">
                We've sent a password reset link to <span className="font-semibold">{email}</span>.
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Return to Login
              </button>
              <button
                onClick={() => {
                  setResetSent(false);
                  setEmail("");
                }}
                className="w-full mt-4 bg-white text-gray-600 border border-gray-300 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50"
              >
                Try a Different Email
              </button>
            </div>
          ) : (
            // Form state
            <div>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex items-center">
                    <FaExclamationCircle className="text-red-500 mr-2" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaLock className="text-blue-600 text-3xl" />
                </div>
                <h2 className="text-xl font-bold mb-2">Forgot Your Password?</h2>
                <p className="text-gray-600">
                  No worries! Enter your email address and we'll send you instructions to reset your
                  password.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center">
                      <FaEnvelope className="mr-2 text-gray-400" />
                      <span>Email Address</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full mt-4 bg-white text-gray-600 border border-gray-300 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}
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

export default ResetPasswordPage;
