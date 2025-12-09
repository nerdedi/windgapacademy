import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calculator,
  CheckCircle,
  Eye,
  Heart,
  Laptop,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeModern() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const learningPaths = [
    {
      id: "literacy",
      title: "Literacy & Reading",
      description: "Build essential reading, writing, and communication skills at your own pace",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-600",
      features: [
        "Phonics & Decoding",
        "Reading Comprehension",
        "Written Expression",
        "Vocabulary Building",
      ],
      path: "/dashboard",
    },
    {
      id: "numeracy",
      title: "Numeracy & Math",
      description: "Develop confidence with numbers, patterns, and problem-solving",
      icon: Calculator,
      color: "from-green-500 to-emerald-600",
      features: ["Number Sense", "Basic Operations", "Fractions & Decimals", "Real-World Math"],
      path: "/dashboard",
    },
    {
      id: "life-skills",
      title: "Life Skills",
      description: "Learn practical skills for everyday independence and success",
      icon: Heart,
      color: "from-purple-500 to-pink-600",
      features: ["Money Management", "Time & Organization", "Social Skills", "Decision Making"],
      path: "/dashboard",
    },
    {
      id: "digital",
      title: "Digital Literacy",
      description: "Navigate technology safely and confidently in today&apos;s digital world",
      icon: Laptop,
      color: "from-orange-500 to-red-600",
      features: ["Computer Basics", "Internet Safety", "Communication Tools", "Online Learning"],
      path: "/dashboard",
    },
  ];

  const supportFeatures = [
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive paths that match your pace and learning style",
    },
    {
      icon: Eye,
      title: "Accessibility First",
      description: "Built with text-to-speech, high contrast, and screen reader support",
    },
    {
      icon: Brain,
      title: "Neurodivergent Friendly",
      description: "Designed for diverse learning needs including ADHD, dyslexia, and autism",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Celebrate achievements and see your growth over time",
    },
  ];

  const quickActions = [
    {
      label: "Get Started",
      action: () => navigate("/dashboard"),
      variant: "primary",
    },
    {
      label: "Try Windgap Academy",
      action: () => navigate("/academy"),
      variant: "primary",
    },
    {
      label: "Learn More",
      action: () => navigate("/about"),
      variant: "secondary",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-16 md:py-24"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to Windgap Academy
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-4">
              Your personalized learning platform for literacy, numeracy, and life skills
            </p>
            <p className="text-lg text-gray-600">
              Empowering learners with support for language, literacy, numeracy, and digital skills
              (LLND)
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className={`
                  px-8 py-4 rounded-xl font-semibold text-lg shadow-lg
                  transition-all duration-300
                  ${
                    action.variant === "primary"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl"
                      : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200"
                  }
                `}
              >
                {action.label}
                {action.variant === "primary" && (
                  <ArrowRight className="inline-block ml-2" size={20} />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Learning Paths Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Choose Your Learning Path</h2>
          <p className="text-xl text-gray-600">
            Explore our comprehensive programs designed for your success
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              onHoverStart={() => setHoveredPath(path.id)}
              onHoverEnd={() => setHoveredPath(null)}
              className="group relative"
            >
              <div
                className={`
                  relative overflow-hidden rounded-2xl p-8
                  bg-white shadow-lg
                  transition-all duration-300
                  ${hoveredPath === path.id ? "shadow-2xl transform -translate-y-2" : ""}
                `}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${path.color} mb-4`}
                  >
                    <path.icon className="text-white" size={32} />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{path.title}</h3>
                  <p className="text-gray-600 mb-6">{path.description}</p>

                  <ul className="space-y-2 mb-6">
                    {path.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="text-green-500 mr-2 flex-shrink-0" size={18} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(path.path)}
                    className={`
                      w-full py-3 px-6 rounded-lg font-semibold
                      bg-gradient-to-r ${path.color}
                      text-white shadow-md
                      hover:shadow-lg transition-all duration-300
                      flex items-center justify-center gap-2
                    `}
                  >
                    Start Learning
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Support Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Designed for Your Success</h2>
            <p className="text-xl text-gray-600">
              Supporting diverse learning needs with inclusive, accessible education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {supportFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="container mx-auto px-4 py-16"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Begin Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of learners and unlock your full potential
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Learning Today
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
