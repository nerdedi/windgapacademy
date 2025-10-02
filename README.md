# Windgap Academy

A modern educational platform featuring interactive Unity WebGL experiences, progress tracking, and real-time user engagement for immersive learning.

## Features

- **Interactive Unity WebGL Experiences**: Seamlessly integrated educational content built with Unity
- **Progress Tracking**: Comprehensive system for tracking student progress and achievements
- **User Authentication**: Secure Firebase authentication with role-based access control
- **AI Assistant Integration**: AI-powered assistance for complex sentence construction, grammar correction, and symbol interpretation
- **Performance Optimizations**: Specialized WebGL optimization for better performance across devices
- **Responsive Design**: Fully responsive UI with Tailwind CSS and Framer Motion animations

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Firebase account
- Unity 2021.3 or higher (for Unity development)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/windgapacademy.git
   cd windgapacademy
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with your Firebase and OpenAI configuration:

   ```
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id

   # OpenAI Configuration (for AI Assistant)
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_MODEL=gpt-4
   OPENAI_BASE_URL=https://api.openai.com/v1
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
windgapacademy/
├── assets/            # Static assets (images, fonts, etc.)
├── components/        # React components
│   ├── ui/            # UI components
│   └── ...            # Feature-specific components
├── context/           # React context providers
├── firebase/          # Firebase configuration and services
├── hooks/             # Custom React hooks
├── pages/             # Page components
├── services/          # API services
├── styles/            # Global styles
├── unity-integration/ # Unity WebGL integration files
│   ├── builds/        # Unity WebGL builds
│   └── scripts/       # Unity-React communication scripts
├── utils/             # Utility functions
└── ...
```

## Unity Integration

### Components

The platform includes several specialized components for Unity integration:

- `UnityExperienceDemo`: Complete Unity experience with progress tracking
- `OptimizedUnityPlayer`: Performance-optimized Unity WebGL player
- `ProgressTracker`: Dashboard for tracking user progress
- `UnityIntegrationExample`: Comprehensive example component demonstrating all integration features
- `AIAssistant`: AI-powered assistant for AAC (Augmentative and Alternative Communication) features

### Utilities

- `WebGLOptimizer`: Utility for optimizing Unity WebGL performance
- `ProgressService`: Firebase service for progress tracking and management

For detailed documentation on Unity integration, see [UNITY_INTEGRATION_COMPONENTS.md](docs/UNITY_INTEGRATION_COMPONENTS.md).

## Development Workflow

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run e2e

# Run security audit
npm run security:audit
```

### Unity Development

For Unity development, see the [Unity Integration Guide](UNITY_INTEGRATION.md).

## Testing

- **Unit Tests**: Jest and React Testing Library

  ```
  npm test
  ```

- **End-to-End Tests**: Playwright
  ```
  npm run e2e
  ```

## Deployment

### Firebase Deployment

```bash
# Deploy to Firebase
npm run deploy
```

### Vercel Deployment

```bash
# Deploy to Vercel
npm run deploy:vercel
```

## Security

Windgap Academy takes security seriously. We have implemented several tools and practices to maintain the security of our codebase:

### Security Tools

- **Automated Security Audits**: Run comprehensive security checks with our scripts:

  ```bash
  # For all projects
  ./scripts/comprehensive-security-audit.sh

  # For FreeSpeech module only
  ./scripts/update-freespeech-security.sh
  ```

- **Dependabot Integration**: Automated dependency updates with security patches
- **Regular Security Scans**: `npm run security:audit` for vulnerability checks

For more information, see our [Security Management Guide](docs/SECURITY_MANAGEMENT.md) and [Security Updates](SECURITY_UPDATES.md) documentation.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase](https://firebase.google.com/)
- [Unity WebGL](https://unity.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js](https://threejs.org/)
