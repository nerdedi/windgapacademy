import Navigation from "../components/Navigation";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            About Windgap Academy
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We're revolutionizing education with advanced technology and innovative learning
            approaches.
          </p>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-indigo-300">Our Mission</h2>
            <p className="text-gray-300">
              To provide accessible, adaptive, and engaging educational experiences that accommodate
              diverse learning styles and abilities, ensuring every learner can reach their full
              potential.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">Our Vision</h2>
            <p className="text-gray-300">
              A world where education transcends traditional boundaries, where technology and human
              creativity combine to create personalized learning journeys that inspire curiosity,
              foster growth, and empower individuals.
            </p>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Approach</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4 text-blue-400">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Personalization</h3>
            <p className="text-gray-300">
              We use advanced AI to understand each learner's unique needs and adapt content
              accordingly.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4 text-green-400">🔄</div>
            <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
            <p className="text-gray-300">
              Our platform evolves based on learning patterns and outcomes, constantly refining the
              experience.
            </p>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4 text-purple-400">🧩</div>
            <h3 className="text-xl font-semibold mb-2">Inclusive Design</h3>
            <p className="text-gray-300">
              We design for neurodiversity and different learning styles from the ground up, not as
              an afterthought.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              name: "Dr. Alex Rivera",
              role: "Founder & CEO",
              bio: "Expert in educational neuroscience with 15+ years experience in adaptive learning systems.",
              image: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Dr. Maya Johnson",
              role: "Chief Learning Officer",
              bio: "Specialized in cognitive psychology and personalized learning methodologies.",
              image: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              name: "Sam Chen",
              role: "CTO",
              bio: "AI and machine learning expert with a background in educational technology.",
              image: "https://randomuser.me/api/portraits/men/22.jpg",
            },
            {
              name: "Taylor Patel",
              role: "Head of Design",
              bio: "Focused on creating accessible, engaging interfaces for diverse learners.",
              image: "https://randomuser.me/api/portraits/women/28.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="bg-gray-800/30 rounded-xl p-6 text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 border-2 border-purple-500"
              />
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-purple-400 mb-2">{member.role}</p>
              <p className="text-gray-400 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Technology Stack</h2>
        <div className="bg-gray-800/30 rounded-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Frontend Technologies</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  React 18 with Vite for high-performance rendering
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Three.js and WebGL for immersive 3D experiences
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Framer Motion for fluid animations
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Tailwind CSS for adaptive and responsive design
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Unity WebGL integration for interactive simulations
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Backend Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Firebase for authentication and real-time data
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Custom AI learning models for personalization
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Advanced analytics for performance tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Secure cloud infrastructure
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  RESTful and GraphQL APIs for extensibility
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-8 max-w-3xl mx-auto">
          <p className="text-center text-gray-300 mb-6">
            Interested in learning more about Windgap Academy? Have questions about our approach or
            technologies? We'd love to hear from you!
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors">
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
