import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { FaApple, FaExclamationCircle, FaFacebook, FaGoogle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import ModernBackground from "./ModernBackground";
import { ModernCard, ModernCardBody, ModernCardFooter } from "./ModernCard";
import ModernInput from "./ModernInput";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    signInWithApple,
    currentUser,
    loading,
    error: authError,
  } = useAuth();

  const formRef = useRef(null);
  const headingRef = useRef(null);
  const socialButtonsRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    userType: "learner",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // GSAP animations
  useGSAP(() => {
    // Animate header elements
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
    );

    // Animate form
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" },
    );

    // Animate social buttons with stagger
    gsap.fromTo(
      socialButtonsRef.current.children,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.5,
        ease: "back.out(1.2)",
      },
    );
  }, []);

  // Animation for form switch (login/signup)
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [isLogin]);

  const buttonRef = useRef(null);

  // Button hover animations
  const handleButtonHover = () => {
    if (!isSubmitting && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        boxShadow: "0 0 20px rgba(41, 151, 255, 0.4)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleButtonLeave = () => {
    if (!isSubmitting && buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !loading) {
      // Redirect to the page they were trying to access, or to dashboard
      const destination = location.state?.from?.pathname || "/dashboard";
      navigate(destination);
    }
  }, [currentUser, loading, navigate, location]);

  const validateForm = () => {
    const errors = {};
    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Name validation (for signup only)
    if (!isLogin && !formData.name) {
      errors.name = "Name is required";
    }

    // Password confirmation (for signup only)
    if (!isLogin && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Login flow
        await signIn(formData.email, formData.password);
        // Navigate handled by the useEffect
      } else {
        // Signup flow
        await signUp(formData.email, formData.password, formData.name, formData.userType);
        // Show success or redirect to email verification page
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setGeneralError(
        error.message || "An error occurred during authentication. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setGeneralError("");
    setIsSubmitting(true);

    try {
      switch (provider) {
        case "google":
          await signInWithGoogle();
          break;
        case "facebook":
          await signInWithFacebook();
          break;
        case "apple":
          await signInWithApple();
          break;
        default:
          throw new Error("Invalid provider");
      }
      // Navigate handled by the useEffect
    } catch (error) {
      console.error("Social login error:", error);
      setGeneralError(
        error.message || `An error occurred during ${provider} login. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear specific field error when typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: "",
      });
    }
  };

  const handleDemoLogin = async (userType) => {
    setGeneralError("");
    setIsSubmitting(true);

    const demoEmail = userType === "educator" ? "educator@demo.com" : "learner@demo.com";
    const demoPassword = "demo123456";

    // Update form data for visual feedback
    setFormData({
      email: demoEmail,
      password: demoPassword,
      name: userType === "educator" ? "Demo Educator" : "Demo Learner",
      userType,
    });

    try {
      // Directly call the signIn function
      await signIn(demoEmail, demoPassword);
      // Navigation handled by useEffect watching currentUser
    } catch (error) {
      console.error("Demo login error:", error);
      // If demo account doesn&apos;t exist, try to create it
      try {
        await signUp(
          demoEmail,
          demoPassword,
          userType === "educator" ? "Demo Educator" : "Demo Learner",
          userType,
        );
        // After signup, sign in
        await signIn(demoEmail, demoPassword);
      } catch (signupError) {
        console.error("Demo account creation error:", signupError);
        setGeneralError("Demo account not available. Please try manual login or contact support.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-trigger demo educator login if routed from EducatorDashboard
  useEffect(() => {
    if (location.state?.demoEducator && !currentUser) {
      handleDemoLogin("educator");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.demoEducator]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-8">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Loading Experience...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernBackground
      primaryColor="#2997FF"
      secondaryColor="#101010"
      hasNoise={true}
      interactive={true}
    >
      <div className="min-h-screen flex items-center justify-center px-8 overflow-hidden">
        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8" ref={headingRef}>
            <button
              onClick={() => navigate("/")}
              className="text-2xl font-semibold text-white mb-6 hover:text-blue transition-colors duration-300"
            >
              Windgap Academy
            </button>
            <h1 className="text-3xl font-bold text-white mb-2 hero-title">
              {isLogin ? "Welcome Back" : "Join Windgap Academy"}
            </h1>
            <p className="text-gray-200 opacity-0 translate-y-4 animate-fadeIn">
              {isLogin
                ? "Sign in to continue your learning journey"
                : "Start your learning journey today"}
            </p>
          </div>

          {/* Login Form */}
          <ModernCard className="animate-float" padding="p-8" withGlow={true} ref={formRef}>
            <ModernCardBody>
              {/* General Error Message */}
              {(generalError || authError) && (
                <div className="mb-6 p-4 bg-red-900/30 border-l-4 border-red-500 rounded-md backdrop-blur-sm">
                  <div className="flex items-center">
                    <FaExclamationCircle className="text-red-500 mr-2" />
                    <p className="text-red-400 text-sm font-medium">{generalError || authError}</p>
                  </div>
                </div>
              )}

              {/* Social Login Buttons */}
              <div className="space-y-3 mb-6" ref={socialButtonsRef}>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-blue focus:outline-none text-white backdrop-blur-sm"
                >
                  <FaGoogle className="text-red-500 mr-3" />
                  <span>{isLogin ? "Sign in with Google" : "Sign up with Google"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-blue focus:outline-none text-white backdrop-blur-sm"
                >
                  <FaFacebook className="text-blue-600 mr-3" />
                  <span>{isLogin ? "Sign in with Facebook" : "Sign up with Facebook"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 focus:ring-2 focus:ring-blue focus:outline-none text-white backdrop-blur-sm"
                >
                  <FaApple className="text-white mr-3" />
                  <span>{isLogin ? "Sign in with Apple" : "Sign up with Apple"}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-zinc-900/30 text-gray-300">Or continue with email</span>
                </div>
              </div>

              {/* Form Inputs */}
              <form id="auth-form" onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <ModernInput
                    id="name"
                    type="text"
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange({
                        target: { name: "name", value: e.target.value },
                      })
                    }
                    error={formErrors.name}
                    required={!isLogin}
                    darkMode={true}
                  />
                )}

                <ModernInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: "email", value: e.target.value },
                    })
                  }
                  error={formErrors.email}
                  required={true}
                  darkMode={true}
                />

                <ModernInput
                  id="password"
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange({
                      target: { name: "password", value: e.target.value },
                    })
                  }
                  error={formErrors.password}
                  required={true}
                  darkMode={true}
                />

                {!isLogin && (
                  <>
                    <ModernInput
                      id="confirmPassword"
                      type="password"
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange({
                          target: { name: "confirmPassword", value: e.target.value },
                        })
                      }
                      error={formErrors.confirmPassword}
                      required={!isLogin}
                      darkMode={true}
                    />

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">I am a...</label>
                      <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-zinc-900/30 border border-zinc-800/50 text-white rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent transition-all backdrop-blur-sm"
                        disabled={isSubmitting}
                      >
                        <option value="learner">Learner</option>
                        <option value="educator">Educator</option>
                        <option value="support_worker">Support Worker</option>
                        <option value="family_member">Family Member</option>
                      </select>
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue focus:ring-blue border-zinc-800/50 rounded bg-zinc-900/30"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => navigate("/reset-password")}
                        className="font-medium text-blue hover:text-white transition-colors duration-300"
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  ref={buttonRef}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                  className="w-full bg-gradient-blue text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:opacity-90 shadow-lg disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                    </div>
                  ) : (
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                  )}
                </button>
              </form>
            </ModernCardBody>

            <ModernCardFooter>
              {/* Toggle Login/Signup */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormErrors({});
                    setGeneralError("");
                  }}
                  className="text-blue hover:text-white font-medium transition-colors duration-300"
                  disabled={isSubmitting}
                >
                  {isLogin
                    ? "Don&apos;t have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              </div>

              {/* Demo Access */}
              <div className="mt-4 pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-300 mb-3">Quick Demo Access</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleDemoLogin("learner")}
                      disabled={isSubmitting}
                      className="bg-green-900/30 text-green-400 py-2 px-4 rounded-lg text-sm font-medium border border-green-500/30 hover:bg-green-800/30 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm"
                    >
                      Demo Learner
                    </button>
                    <button
                      onClick={() => handleDemoLogin("educator")}
                      disabled={isSubmitting}
                      className="bg-purple-900/30 text-purple-400 py-2 px-4 rounded-lg text-sm font-medium border border-purple-500/30 hover:bg-purple-800/30 transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm"
                    >
                      Demo Educator
                    </button>
                  </div>
                </div>
              </div>
            </ModernCardFooter>
          </ModernCard>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-900/30 p-4 rounded-xl backdrop-blur-sm border border-zinc-800/50 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-2xl mb-2">♿</div>
              <div className="text-xs text-gray-300">Fully Accessible</div>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl backdrop-blur-sm border border-zinc-800/50 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-xs text-gray-300">Secure & Private</div>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl backdrop-blur-sm border border-zinc-800/50 hover:border-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-xs text-gray-300">Mobile Friendly</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex justify-center space-x-6 text-xs text-gray-400">
              <button className="hover:text-blue transition-colors duration-300">
                Privacy Policy
              </button>
              <button className="hover:text-blue transition-colors duration-300">
                Terms of Service
              </button>
              <button className="hover:text-blue transition-colors duration-300">Support</button>
            </div>
          </div>
        </div>
      </div>
    </ModernBackground>
  );
}

export default LoginPage;
