#!/bin/bash

# Script to generate OAuth provider integration files
# Usage: ./scripts/generate-oauth-provider.sh <provider-name>

set -e

if [ -z "$1" ]; then
    echo "Error: Please provide a provider name"
    echo "Usage: ./scripts/generate-oauth-provider.sh <provider-name>"
    exit 1
fi

# Convert to lowercase and capitalize first letter for component names
PROVIDER_LOWER=$(echo "$1" | tr '[:upper:]' '[:lower:]')
PROVIDER_CAPITAL=$(echo "$1" | sed 's/^\([a-z]\)/\U\1/')

echo "Generating OAuth provider files for: $PROVIDER_CAPITAL"

# Create directory structure if it doesn't exist
mkdir -p src/utils
mkdir -p src/components/auth
mkdir -p __tests__/utils
mkdir -p __tests__/components
mkdir -p backend/controllers
mkdir -p backend/routes

# Create the auth utility file
cat > src/utils/${PROVIDER_LOWER}Auth.js << EOF
/**
 * ${PROVIDER_CAPITAL} Authentication Utility
 * Handles ${PROVIDER_CAPITAL} Sign In authentication flow for Windgap Academy
 */

/**
 * Initialize ${PROVIDER_CAPITAL} Sign In
 * This should be called when the application starts
 */
export const initialize${PROVIDER_CAPITAL}Auth = () => {
  // Add initialization code for ${PROVIDER_CAPITAL} here
  console.log('${PROVIDER_CAPITAL} auth initialized');
};

/**
 * Sign in with ${PROVIDER_CAPITAL}
 * @returns {Promise} Promise that resolves with the authentication data
 */
export const signInWith${PROVIDER_CAPITAL} = () => {
  return new Promise((resolve, reject) => {
    try {
      // Implement ${PROVIDER_CAPITAL} authentication flow here

      // Example implementation (replace with actual implementation):
      // const authInstance = window.${PROVIDER_CAPITAL}Auth.getAuthInstance();
      // authInstance.signIn().then(
      //   (user) => {
      //     resolve({
      //       provider: '${PROVIDER_LOWER}',
      //       token: user.getAuthResponse().id_token,
      //       user: {
      //         name: user.getBasicProfile().getName(),
      //         email: user.getBasicProfile().getEmail()
      //       }
      //     });
      //   },
      //   (error) => {
      //     reject(error);
      //   }
      // );

      // Temporary placeholder - replace with actual implementation
      setTimeout(() => {
        resolve({
          provider: '${PROVIDER_LOWER}',
          token: 'example-token',
          user: {
            name: '${PROVIDER_CAPITAL} User',
            email: 'user@example.com'
          }
        });
      }, 1000);
    } catch (error) {
      console.error('${PROVIDER_CAPITAL} Sign In error', error);
      reject(error);
    }
  });
};

/**
 * Create backend authentication URL for ${PROVIDER_CAPITAL}
 * @param {Object} authData Data from ${PROVIDER_CAPITAL} Sign In
 * @returns {string} URL for backend authentication
 */
export const createAuthUrl = (authData) => {
  const params = new URLSearchParams({
    token: authData.token,
    ...(authData.user?.name && { name: authData.user.name }),
    ...(authData.user?.email && { email: authData.user.email }),
  });

  return \`/api/auth/${PROVIDER_LOWER}/callback?\${params.toString()}\`;
};

export default {
  initialize${PROVIDER_CAPITAL}Auth,
  signInWith${PROVIDER_CAPITAL},
  createAuthUrl
};
EOF

# Create the sign-in button component
cat > src/components/auth/${PROVIDER_CAPITAL}SignInButton.jsx << EOF
import React, { useEffect } from 'react';
import { initialize${PROVIDER_CAPITAL}Auth, signInWith${PROVIDER_CAPITAL} } from '@utils/${PROVIDER_LOWER}Auth';
import { useAuth } from '@contexts/AuthContext';

const ${PROVIDER_CAPITAL}SignInButton = ({ className, onSuccess, onError }) => {
  const { setUser } = useAuth();

  useEffect(() => {
    // Initialize ${PROVIDER_CAPITAL} Sign In when component mounts
    initialize${PROVIDER_CAPITAL}Auth();
  }, []);

  const handle${PROVIDER_CAPITAL}SignIn = async () => {
    try {
      const authData = await signInWith${PROVIDER_CAPITAL}();

      // For demo purposes - in production, you would send this to your backend
      // and get a proper user object with roles, etc.
      const userProfile = {
        id: authData.user?.email || '${PROVIDER_LOWER}-user',
        name: authData.user?.name || '${PROVIDER_CAPITAL} User',
        email: authData.user?.email || '',
        provider: '${PROVIDER_LOWER}',
        photoURL: authData.user?.picture || '',
        authToken: authData.token
      };

      // Update auth context with user data
      setUser(userProfile);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(userProfile);
      }
    } catch (error) {
      console.error('${PROVIDER_CAPITAL} Sign In failed:', error);

      // Call onError callback if provided
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handle${PROVIDER_CAPITAL}SignIn}
      className={\`flex items-center justify-center gap-2 bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors \${className || ''}\`}
      aria-label="Sign in with ${PROVIDER_CAPITAL}"
    >
      {/* ${PROVIDER_CAPITAL} logo - replace with appropriate icon */}
      <span className="w-5 h-5 flex items-center justify-center">
        ${PROVIDER_CAPITAL}
      </span>
      Sign in with ${PROVIDER_CAPITAL}
    </button>
  );
};

export default ${PROVIDER_CAPITAL}SignInButton;
EOF

# Create a test for the auth utility
cat > __tests__/utils/${PROVIDER_LOWER}Auth.test.js << EOF
/**
 * @jest-environment jsdom
 */
import { initialize${PROVIDER_CAPITAL}Auth, signInWith${PROVIDER_CAPITAL}, createAuthUrl } from '../../src/utils/${PROVIDER_LOWER}Auth';

// Mock the global window object if needed
global.window = Object.create(window);
Object.defineProperty(window, 'location', {
  value: {
    origin: 'https://windgapacademy.org'
  },
  writable: true
});

describe('${PROVIDER_CAPITAL} Authentication Utility', () => {
  beforeEach(() => {
    // Add your mocks here
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('initialize${PROVIDER_CAPITAL}Auth', () => {
    it('should initialize ${PROVIDER_CAPITAL} auth', () => {
      initialize${PROVIDER_CAPITAL}Auth();
      expect(console.log).toHaveBeenCalledWith('${PROVIDER_CAPITAL} auth initialized');
    });
  });

  describe('signInWith${PROVIDER_CAPITAL}', () => {
    it('should resolve with authentication data when sign in is successful', async () => {
      const result = await signInWith${PROVIDER_CAPITAL}();

      expect(result).toEqual({
        provider: '${PROVIDER_LOWER}',
        token: 'example-token',
        user: {
          name: '${PROVIDER_CAPITAL} User',
          email: 'user@example.com'
        }
      });
    });

    // Add more tests as needed
  });

  describe('createAuthUrl', () => {
    it('should create a valid authentication URL with all parameters', () => {
      const authData = {
        token: 'test-token',
        user: {
          name: 'Test User',
          email: 'test@example.com'
        }
      };

      const url = createAuthUrl(authData);

      expect(url).toBe('/api/auth/${PROVIDER_LOWER}/callback?token=test-token&name=Test+User&email=test%40example.com');
    });

    it('should create a valid authentication URL with minimal parameters', () => {
      const authData = {
        token: 'test-token'
      };

      const url = createAuthUrl(authData);

      expect(url).toBe('/api/auth/${PROVIDER_LOWER}/callback?token=test-token');
    });
  });
});
EOF

# Create a test for the sign-in button component
cat > __tests__/components/${PROVIDER_CAPITAL}SignInButton.test.js << EOF
/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${PROVIDER_CAPITAL}SignInButton from '../../src/components/auth/${PROVIDER_CAPITAL}SignInButton';
import * as ${PROVIDER_LOWER}Auth from '../../src/utils/${PROVIDER_LOWER}Auth';
import { useAuth } from '../../src/contexts/AuthContext';

// Mock the ${PROVIDER_LOWER}Auth module
jest.mock('../../src/utils/${PROVIDER_LOWER}Auth', () => ({
  initialize${PROVIDER_CAPITAL}Auth: jest.fn(),
  signInWith${PROVIDER_CAPITAL}: jest.fn()
}));

// Mock the AuthContext
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('${PROVIDER_CAPITAL}SignInButton', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useAuth hook
    useAuth.mockReturnValue({
      setUser: jest.fn()
    });
  });

  it('should render correctly', () => {
    render(<${PROVIDER_CAPITAL}SignInButton />);

    expect(screen.getByText('Sign in with ${PROVIDER_CAPITAL}')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should initialize ${PROVIDER_CAPITAL} Sign In on mount', () => {
    render(<${PROVIDER_CAPITAL}SignInButton />);

    expect(${PROVIDER_LOWER}Auth.initialize${PROVIDER_CAPITAL}Auth).toHaveBeenCalled();
  });

  it('should apply custom className if provided', () => {
    render(<${PROVIDER_CAPITAL}SignInButton className="custom-class" />);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should handle sign in when button is clicked', async () => {
    const mockUser = {
      user: {
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'test-token'
    };

    ${PROVIDER_LOWER}Auth.signInWith${PROVIDER_CAPITAL}.mockResolvedValue(mockUser);

    const mockOnSuccess = jest.fn();

    render(<${PROVIDER_CAPITAL}SignInButton onSuccess={mockOnSuccess} />);

    fireEvent.click(screen.getByRole('button'));

    // Wait for the promise to resolve
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(${PROVIDER_LOWER}Auth.signInWith${PROVIDER_CAPITAL}).toHaveBeenCalled();
    expect(useAuth().setUser).toHaveBeenCalledWith({
      id: 'test@example.com',
      name: 'Test User',
      email: 'test@example.com',
      provider: '${PROVIDER_LOWER}',
      photoURL: '',
      authToken: 'test-token'
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should handle error when sign in fails', async () => {
    const mockError = new Error('Sign in failed');
    ${PROVIDER_LOWER}Auth.signInWith${PROVIDER_CAPITAL}.mockRejectedValue(mockError);

    const mockOnError = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<${PROVIDER_CAPITAL}SignInButton onError={mockOnError} />);

    fireEvent.click(screen.getByRole('button'));

    // Wait for the promise to reject
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(${PROVIDER_LOWER}Auth.signInWith${PROVIDER_CAPITAL}).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('${PROVIDER_CAPITAL} Sign In failed:', mockError);
    expect(mockOnError).toHaveBeenCalledWith(mockError);

    consoleSpy.mockRestore();
  });
});
EOF

# Create a backend controller
cat > backend/controllers/${PROVIDER_LOWER}AuthController.js << EOF
/**
 * ${PROVIDER_CAPITAL} Sign-In Callback Handler
 *
 * This file handles the backend processing of ${PROVIDER_CAPITAL} Sign In authentication.
 * It verifies the token, creates or updates the user in the database,
 * and establishes a session.
 */

const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin if not already initialized
const initFirebaseAdmin = require('../../firebase/admin');
initFirebaseAdmin();

/**
 * Verify ${PROVIDER_CAPITAL} ID token
 * @param {string} idToken - The ID token from ${PROVIDER_CAPITAL}
 * @returns {Promise<Object>} The decoded token payload
 */
async function verify${PROVIDER_CAPITAL}Token(idToken) {
  try {
    // In production, you would validate this token with ${PROVIDER_CAPITAL}'s verification endpoint
    // This is a simplified version for demonstration purposes

    // Verify the token using Firebase Auth
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    return decodedToken;
  } catch (error) {
    console.error('Error verifying ${PROVIDER_CAPITAL} token:', error);
    throw error;
  }
}

/**
 * Create or update user in Firestore
 * @param {Object} userData - User data from ${PROVIDER_CAPITAL}
 * @param {string} uid - Firebase user ID
 * @returns {Promise<Object>} User document
 */
async function createOrUpdateUser(userData, uid) {
  const db = getFirestore();
  const userRef = db.collection('users').doc(uid);

  // Get existing user data or create a new document
  const userDoc = await userRef.get();

  const now = new Date().toISOString();
  let userData2Save = {};

  if (userDoc.exists) {
    // Update existing user
    userData2Save = {
      lastLogin: now,
      updatedAt: now,
      provider: '${PROVIDER_LOWER}',
      ...userData
    };
  } else {
    // Create new user
    userData2Save = {
      createdAt: now,
      lastLogin: now,
      updatedAt: now,
      provider: '${PROVIDER_LOWER}',
      role: 'student', // Default role
      isActive: true,
      ...userData
    };
  }

  await userRef.set(userData2Save, { merge: true });

  return {
    uid,
    ...userData2Save
  };
}

/**
 * Handle ${PROVIDER_CAPITAL} Sign In callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handle${PROVIDER_CAPITAL}Callback(req, res) {
  try {
    const { token, name, email } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify the token
    const payload = await verify${PROVIDER_CAPITAL}Token(token);

    if (!payload.sub) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const ${PROVIDER_LOWER}UserId = payload.sub;

    // Check if user exists in Firebase Auth
    const auth = getAuth();
    let firebaseUser;

    try {
      // Try to get user by ${PROVIDER_CAPITAL} ID
      firebaseUser = await auth.getUserByProviderUid('${PROVIDER_LOWER}.com', ${PROVIDER_LOWER}UserId);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // User doesn't exist, create a new one
        const userEmail = email || payload.email || \`\${${PROVIDER_LOWER}UserId}@${PROVIDER_LOWER}.windgapacademy.org\`;
        const displayName = name || payload.name || '${PROVIDER_CAPITAL} User';

        firebaseUser = await auth.createUser({
          displayName,
          email: userEmail,
          emailVerified: true, // ${PROVIDER_CAPITAL} verifies emails
          providerData: [{
            uid: ${PROVIDER_LOWER}UserId,
            providerId: '${PROVIDER_LOWER}.com',
            displayName,
            email: userEmail
          }]
        });

        // Link ${PROVIDER_CAPITAL} provider to the user
        await auth.updateUser(firebaseUser.uid, {
          providerToLink: {
            providerId: '${PROVIDER_LOWER}.com',
            uid: ${PROVIDER_LOWER}UserId
          }
        });
      } else {
        throw error;
      }
    }

    // Create custom token for client-side Firebase Auth
    const customToken = await auth.createCustomToken(firebaseUser.uid);

    // Store additional user data in Firestore
    const userData = {
      displayName: name || payload.name || '${PROVIDER_CAPITAL} User',
      email: email || payload.email,
      ${PROVIDER_LOWER}UserId
    };

    await createOrUpdateUser(userData, firebaseUser.uid);

    // Redirect to frontend with token
    const redirectUrl = \`\${process.env.FRONTEND_URL || '/'}?token=\${customToken}&provider=${PROVIDER_LOWER}\`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('${PROVIDER_CAPITAL} callback error:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
}

module.exports = handle${PROVIDER_CAPITAL}Callback;
EOF

# Create a backend route
cat > backend/routes/${PROVIDER_LOWER}Auth.js << EOF
/**
 * ${PROVIDER_CAPITAL} Sign-In API Route
 */
const express = require('express');
const router = express.Router();
const ${PROVIDER_LOWER}AuthController = require('../controllers/${PROVIDER_LOWER}AuthController');

// ${PROVIDER_CAPITAL} Sign In callback endpoint
router.get('/callback', ${PROVIDER_LOWER}AuthController);

module.exports = router;
EOF

echo "✅ OAuth provider files for $PROVIDER_CAPITAL created successfully!"
echo ""
echo "Next steps:"
echo "1. Update src/utils/oauthImplementation.js to include $PROVIDER_CAPITAL provider"
echo "2. Add $PROVIDER_CAPITAL}SignInButton to your login pages"
echo "3. Configure the backend routes to handle $PROVIDER_CAPITAL authentication callbacks"
echo "4. Set up the required environment variables"
echo ""
echo "Happy coding! 🚀"
