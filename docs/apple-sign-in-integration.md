# OAuth Authentication with Apple Sign-In

This document describes the implementation of Apple Sign-In authentication for Windgap Academy.

## Overview

Apple Sign In is part of our OAuth authentication strategy, providing users with a secure and privacy-focused option for authenticating with the Windgap Academy platform. This implementation follows Apple's guidelines for Sign in with Apple and integrates with our existing authentication system.

## Implementation Details

### Frontend Components

1. **AppleSignInButton.jsx** - A React component that renders the "Sign in with Apple" button and handles the authentication flow.
2. **appleAuth.js** - A utility module that provides functions for initializing Apple Sign In, handling the sign-in process, and creating authentication URLs.

### Backend Components

1. **appleAuthController.js** - A controller that handles the Apple Sign In callback, verifies tokens, and creates or updates user records.
2. **appleAuth.js** (route) - An Express route that handles the Apple Sign In callback endpoint.

### Integration with Auth Context

The implementation integrates with our existing `AuthContext` to manage user authentication state consistently across all authentication methods.

## Usage

To use Apple Sign In in your components:

```jsx
import AppleSignInButton from "@components/auth/AppleSignInButton";

const LoginPage = () => {
  const handleSuccess = (userProfile) => {
    console.log("Authentication successful", userProfile);
    // Navigate or perform actions after successful authentication
  };

  const handleError = (error) => {
    console.error("Authentication failed", error);
    // Handle authentication error
  };

  return (
    <div>
      {/* Other login options */}
      <AppleSignInButton onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};
```

## Configuration

The following environment variables are required:

```
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id
VITE_APPLE_CLIENT_ID=your_apple_client_id
```

For the backend:

```
FRONTEND_URL=https://yourdomain.com
```

## Security Considerations

1. **Token Verification** - All tokens received from Apple are verified on the backend before creating user sessions.
2. **Secure Storage** - Authentication tokens are stored securely and not exposed to client-side JavaScript.
3. **HTTPS Only** - All authentication endpoints require HTTPS.

## Testing

Unit tests are provided for both the frontend components and backend controllers. To run the tests:

```bash
npm test -- --testPathPattern=appleAuth
```

## Apple Developer Configuration

To configure Sign in with Apple in the Apple Developer portal:

1. Register an App ID in the Apple Developer portal.
2. Enable "Sign In with Apple" capability.
3. Configure the domains and redirect URLs.
4. Generate a client secret for server-to-server authentication.

For detailed steps, refer to [Apple's documentation](https://developer.apple.com/documentation/sign_in_with_apple/configuring_your_environment_for_sign_in_with_apple).

## References

- [Apple Sign in with Apple Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [Firebase Authentication with Apple](https://firebase.google.com/docs/auth/web/apple)
- [OAuth Implementation Guide](https://example.com/oauth-guide) (internal documentation)

## Attribution

Portions of this code were generated with the assistance of GitHub Copilot.
