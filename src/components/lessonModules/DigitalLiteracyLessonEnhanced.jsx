import React, { useState } from "react";
import { FaLaptop, FaEnvelope, FaSearch, FaShieldAlt, FaCheckCircle } from "react-icons/fa";

import { useAccessibility } from "../../context/AccessibilityContext";
import NeuroLessonContainer from "../NeuroLessonContainer";

function EmailActivity({ usePictorial = true }) {
  const { settings } = useAccessibility();
  const [emailStep, setEmailStep] = useState(0);
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const emailSteps = [
    "Open your email app",
    "Click 'New Email' or 'Compose'",
    "Enter recipient&apos;s email address",
    "Write a clear subject line",
    "Type your message",
    "Check spelling and grammar",
    "Click 'Send'",
  ];

  const nextEmailStep = () => {
    if (emailStep < emailSteps.length - 1) {
      setEmailStep(emailStep + 1);
    }
  };

  const prevEmailStep = () => {
    if (emailStep > 0) {
      setEmailStep(emailStep - 1);
    }
  };

  const handleInputChange = (e) => {
    setEmailData({
      ...emailData,
      [e.target.name]: e.target.value,
    });
  };

  // Determine if we should show pictorial aids based on settings
  const showPictorial = usePictorial && settings.usePictorialReminders;

  // Determine if we should show the flowchart based on settings
  const showFlowchart = settings.useFlowcharts;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">📧 Email Skills</h3>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Email Activity Instructions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Email Steps:</h4>

          {/* Show flowchart if enabled */}
          {showFlowchart && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h5 className="text-md font-medium mb-3 text-blue-800">Email Process Flowchart:</h5>
              <div className="flex flex-col items-center">
                {emailSteps.map((step, index) => (
                  <React.Fragment key={index}>
                    <div
                      className={`p-3 rounded-lg w-full text-center ${emailStep === index ? "bg-blue-600 text-white" : index < emailStep ? "bg-green-100 text-green-800" : "bg-gray-100"}`}
                    >
                      {step}
                    </div>
                    {index < emailSteps.length - 1 && (
                      <div className="h-6 flex items-center justify-center">
                        <div className="h-6 w-0.5 bg-gray-300"></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          <ol className="space-y-3 mb-6">
            {emailSteps.map((step, index) => (
              <li
                key={index}
                className={`p-3 rounded-lg flex items-start ${
                  emailStep === index
                    ? "bg-blue-100 border-l-4 border-blue-600"
                    : index < emailStep
                      ? "bg-green-50 border-l-4 border-green-500"
                      : "bg-gray-50"
                }`}
              >
                <span className="mr-3 mt-0.5">
                  {index < emailStep ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : (
                    <span className="inline-block w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                  )}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          <div className="flex justify-between">
            <button
              onClick={prevEmailStep}
              disabled={emailStep === 0}
              className={`px-4 py-2 rounded-lg ${
                emailStep === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <button
              onClick={nextEmailStep}
              disabled={emailStep === emailSteps.length - 1}
              className={`px-4 py-2 rounded-lg ${
                emailStep === emailSteps.length - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Email Practice Area */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Practice Area:</h4>

          {/* Visual Aid - only show if pictorial reminders are enabled */}
          {showPictorial && (
            <div className="mb-6 text-center">
              {emailStep === 0 && <FaLaptop className="text-5xl mx-auto text-blue-500 mb-2" />}
              {emailStep === 1 && <FaEnvelope className="text-5xl mx-auto text-blue-500 mb-2" />}
              {emailStep === 2 && (
                <div className="text-xl font-semibold text-blue-600">To: ____________</div>
              )}
              {emailStep === 3 && (
                <div className="text-xl font-semibold text-blue-600">Subject: ____________</div>
              )}
              {emailStep === 4 && (
                <div className="h-20 border-2 border-dashed border-blue-300 rounded-lg mb-2"></div>
              )}
              {emailStep === 5 && <FaSearch className="text-5xl mx-auto text-blue-500 mb-2" />}
              {emailStep === 6 && <FaShieldAlt className="text-5xl mx-auto text-green-500 mb-2" />}
            </div>
          )}

          <div
            className={`email-compose-area p-4 border ${emailStep > 0 ? "border-blue-300" : "border-gray-200"} rounded-lg mb-4`}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
              <input
                type="email"
                name="to"
                value={emailData.to}
                onChange={handleInputChange}
                disabled={emailStep < 2}
                className={`w-full p-2 border rounded ${
                  emailStep === 2 ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                }`}
                placeholder="recipient@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
              <input
                type="text"
                name="subject"
                value={emailData.subject}
                onChange={handleInputChange}
                disabled={emailStep < 3}
                className={`w-full p-2 border rounded ${
                  emailStep === 3 ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                }`}
                placeholder="Enter subject line"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
              <textarea
                name="message"
                value={emailData.message}
                onChange={handleInputChange}
                disabled={emailStep < 4}
                className={`w-full p-2 border rounded h-32 ${
                  emailStep === 4 ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-300"
                }`}
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <div className="text-right">
              <button
                disabled={emailStep < 6}
                className={`px-4 py-2 rounded ${
                  emailStep === 6
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send Email
              </button>
            </div>
          </div>

          {/* Simplified Email Tips */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-medium text-yellow-800 mb-2">Email Tips:</h5>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Always include a clear subject line</li>
              <li>• Keep your message brief and to the point</li>
              <li>• Check for spelling errors before sending</li>
              <li>• Be polite and professional</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordActivity() {
  const { settings } = useAccessibility();
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Determine if we should show the checklist based on settings
  const showChecklist = settings.useChecklists;

  const checkPasswordStrength = (pass) => {
    let strength = 0;

    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

    return strength;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-8 mb-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🔒 Password Security</h3>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Create a Strong Password</h4>

          {showChecklist && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium mb-2">Password Checklist:</h5>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span
                    className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${password.length >= 8 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {password.length >= 8 ? "✓" : ""}
                  </span>
                  At least 8 characters long
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${/[A-Z]/.test(password) ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {/[A-Z]/.test(password) ? "✓" : ""}
                  </span>
                  Includes uppercase letters (A-Z)
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${/[a-z]/.test(password) ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {/[a-z]/.test(password) ? "✓" : ""}
                  </span>
                  Includes lowercase letters (a-z)
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${/[0-9]/.test(password) ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {/[0-9]/.test(password) ? "✓" : ""}
                  </span>
                  Includes numbers (0-9)
                </li>
                <li className="flex items-center">
                  <span
                    className={`inline-block w-5 h-5 rounded-full mr-2 flex items-center justify-center ${/[^A-Za-z0-9]/.test(password) ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {/[^A-Za-z0-9]/.test(password) ? "✓" : ""}
                  </span>
                  Includes special characters (!@#$%^&*)
                </li>
              </ul>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a strong password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Strength:
            </label>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  passwordStrength <= 1
                    ? "bg-red-500"
                    : passwordStrength <= 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {passwordStrength <= 1 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"}{" "}
              password
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h4 className="text-lg font-semibold mb-4">Password Tips</h4>

          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800">Use a different password for each account</p>
              <p className="text-sm text-blue-600">
                If one account is compromised, your other accounts stay safe.
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <p className="font-medium text-green-800">Try using a passphrase</p>
              <p className="text-sm text-green-600">
                A series of words with spaces or special characters is often stronger and easier to
                remember than a single word.
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="font-medium text-purple-800">Consider using a password manager</p>
              <p className="text-sm text-purple-600">
                Password managers can generate and store strong passwords for you.
              </p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg">
              <p className="font-medium text-red-800">Avoid using personal information</p>
              <p className="text-sm text-red-600">
                Don&apos;t use your name, birthday, or other personal details that others might
                know.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchActivity() {
  // Additional content would go here
  return (
    <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-3xl p-8 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">🔍 Online Search Skills</h3>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h4 className="text-lg font-semibold mb-4">How to Search Effectively</h4>

        <p className="mb-4">
          This section would include content about effective search techniques.
        </p>
      </div>
    </div>
  );
}

function DigitalLiteracyLessonEnhanced() {
  // Define lesson structure and content
  const lessonTitle = "Digital Literacy: Basic Online Skills";
  const lessonDescription =
    "Learn essential digital skills including email communication, password security, and effective online searching.";
  const estimatedTime = 45;
  const objectives = [
    "Understand the key components of an email and how to compose one",
    "Create and recognize strong passwords for online security",
    "Learn effective search techniques for finding information online",
    "Practice basic digital safety habits",
  ];
  const steps = [
    {
      title: "Email Communication",
      description: "Learn how to compose and send professional emails",
    },
    {
      title: "Password Security",
      description: "Create strong, secure passwords for your accounts",
    },
    {
      title: "Online Search Skills",
      description: "Find information efficiently using search engines",
    },
  ];

  return (
    <NeuroLessonContainer
      title={lessonTitle}
      description={lessonDescription}
      estimatedTime={estimatedTime}
      objectives={objectives}
      steps={steps}
      backPath="/dashboard"
      nextLessonPath="/lesson/internet-safety"
    >
      <EmailActivity />
      <PasswordActivity />
      <SearchActivity />
    </NeuroLessonContainer>
  );
}

export default DigitalLiteracyLessonEnhanced;
