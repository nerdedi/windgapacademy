import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaMobile, FaCheck, FaExclamationCircle, FaArrowLeft } from "react-icons/fa";
import { RecaptchaVerifier } from "firebase/auth";

function SetupMFAPage() {
  const navigate = useNavigate();
  const { currentUser, enrollMFA, completeMFAEnrollment, loading } = useAuth();

  const [step, setStep] = useState(1); // 1: Phone entry, 2: Verification code
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    // Create a RecaptchaVerifier instance
    const verifier = new RecaptchaVerifier("recaptcha-container", {
      size: "normal",
      callback: () => {
        // reCAPTCHA solved, allow the user to send verification code
        setError("");
      },
      "expired-callback": () => {
        setError("reCAPTCHA has expired. Please solve it again.");
      },
    });

    setRecaptchaVerifier(verifier);

    // Cleanup
    return () => {
      if (verifier) {
        verifier.clear();
      }
    };
  }, []);

  const handleSendVerification = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsProcessing(true);

    try {
      const formattedPhoneNumber = phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;

      const verId = await enrollMFA(formattedPhoneNumber, recaptchaVerifier);
      setVerificationId(verId);
      setStep(2);
    } catch (err) {
      console.error("Error sending verification code:", err);
      setError(err.message || "Failed to send verification code. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter a valid verification code");
      return;
    }

    setIsProcessing(true);

    try {
      await completeMFAEnrollment(verificationId, verificationCode);
      setSuccess(true);
    } catch (err) {
      console.error("Error verifying code:", err);
      setError(err.message || "Failed to verify code. Please try again.");
    } finally {
      setIsProcessing(false);
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
          <h1 className="text-3xl font-bold text-black mb-2">
            {success ? "MFA Setup Complete" : "Set Up Two-Factor Authentication"}
          </h1>
          <p className="text-gray-600">
            {success
              ? "Your account is now more secure"
              : "Add an extra layer of security to your account"}
          </p>
        </div>

        {/* MFA Setup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {success ? (
            // Success State
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-green-600 text-3xl" />
              </div>
              <h2 className="text-xl font-bold mb-2">Setup Complete</h2>
              <p className="text-gray-600 mb-8">
                Two-factor authentication has been successfully enabled for your account. You'll now
                need to verify your identity using your phone when signing in.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Continue to Dashboard
              </button>
            </div>
          ) : step === 1 ? (
            // Step 1: Phone Entry
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMobile className="text-blue-600 text-3xl" />
                </div>
                <h2 className="text-xl font-bold mb-2">Add Phone Number</h2>
                <p className="text-gray-600">
                  We'll send a verification code to your phone to verify your identity when you sign
                  in.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex items-center">
                    <FaExclamationCircle className="text-red-500 mr-2" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSendVerification}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (with country code)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={isProcessing}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Include your country code (e.g., +1 for US, +44 for UK)
                  </p>
                </div>

                {/* reCAPTCHA container */}
                <div id="recaptcha-container" className="mb-6"></div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>Sending Code...</span>
                    </div>
                  ) : (
                    "Send Verification Code"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="w-full mt-4 bg-white text-gray-600 border border-gray-300 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50"
                >
                  Skip for Now
                </button>
              </form>
            </div>
          ) : (
            // Step 2: Verification Code
            <div>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaMobile className="text-blue-600 text-3xl" />
                </div>
                <h2 className="text-xl font-bold mb-2">Enter Verification Code</h2>
                <p className="text-gray-600">
                  We've sent a verification code to your phone. Enter it below to complete the
                  setup.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
                  <div className="flex items-center">
                    <FaExclamationCircle className="text-red-500 mr-2" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyCode}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    disabled={isProcessing}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={isProcessing}
                    className="flex-1 bg-white text-gray-600 border border-gray-300 py-3 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 flex items-center justify-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </button>
                </div>
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

export default SetupMFAPage;
