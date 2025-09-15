import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    userType: "learner",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple authentication - in real app would validate with backend
    localStorage.setItem(
      "windgap_user",
      JSON.stringify({
        name: formData.name || formData.email.split("@")[0],
        email: formData.email,
        userType: formData.userType,
        loginTime: new Date().toISOString(),
      }),
    );
    navigate("/dashboard");
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          <h1 className="text-3xl font-bold text-black mb-2">
            {isLogin ? "Welcome Back" : "Join Windgap Academy"}
          </h1>
          <p className="text-gray-600">
            {isLogin
              ? "Sign in to continue your learning journey"
              : "Start your learning journey today"}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="learner">Learner</option>
                  <option value="educator">Educator</option>
                  <option value="support_worker">Support Worker</option>
                  <option value="family_member">Family Member</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "windgap_user",
                      JSON.stringify({
                        name: "Demo Learner",
                        email: "learner@demo.com",
                        userType: "learner",
                        loginTime: new Date().toISOString(),
                      }),
                    );
                    navigate("/dashboard");
                  }}
                  className="bg-green-100 text-green-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                >
                  Demo Learner
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "windgap_user",
                      JSON.stringify({
                        name: "Demo Educator",
                        email: "educator@demo.com",
                        userType: "educator",
                        loginTime: new Date().toISOString(),
                      }),
                    );
                    navigate("/dashboard");
                  }}
                  className="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  Demo Educator
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl mb-2">♿</div>
            <div className="text-xs text-gray-600">Fully Accessible</div>
          </div>
          <div>
            <div className="text-2xl mb-2">🔒</div>
            <div className="text-xs text-gray-600">Secure & Private</div>
          </div>
          <div>
            <div className="text-2xl mb-2">📱</div>
            <div className="text-xs text-gray-600">Mobile Friendly</div>
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

export default LoginPage;
