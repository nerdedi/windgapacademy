# OAuth Authentication System Documentation

## Overview

This document provides detailed information about the OAuth authentication system implemented for Windgap Academy. The system supports multiple authentication providers including Apple, Google, Microsoft, and traditional email/password authentication.

## Architecture

The authentication system is built using the following components:

### Core Components

1. **AuthContext** (`src/contexts/AuthContext.jsx`)
   - Provides authentication state and methods throughout the application
   - Manages user sessions and authentication flow
   - Exposes authentication methods like sign out and profile updates

2. **Provider-specific Authentication Modules**
   - Apple Authentication (`src/utils/appleAuth.js`)
   - Google Authentication (to be implemented)
   - Microsoft Authentication (to be implemented)

3. **OAuth Implementation** (`src/utils/oauthImplementation.js`)
   - Central configuration for all OAuth providers
   - Initializes all OAuth providers
   - Defines standardized structure for provider information

4. **Authentication UI Components**
   - Provider-specific buttons (e.g., `AppleSignInButton.jsx`)
   - Login/Signup pages with OAuth options
   - User profile management

### Backend Components

1. **Authentication Controllers**
   - Provider-specific controllers for handling OAuth callbacks
   - Token validation and user creation/updates

2. **API Routes**
   - Endpoints for OAuth callbacks
   - User profile management

## Authentication Flow

### OAuth Authentication Flow

1. User clicks on a provider-specific sign-in button (e.g., "Sign in with Apple")
2. The provider's authentication flow is initiated via popup or redirect
3. The provider returns authentication tokens after successful authentication
4. The tokens are validated on the backend
5. A user account is created or updated in Firebase Authentication and Firestore
6. A session is established, and the user is redirected to the appropriate page

### Email/Password Authentication Flow

1. User enters email and password on the login form
2. Credentials are validated against Firebase Authentication
3. On successful authentication, the user information is retrieved and set in the AuthContext
4. The user is redirected to the appropriate page

## Protected Routes

The application uses a `ProtectedRoute` component to secure routes that require authentication. This component:

- Redirects unauthenticated users to the login page
- Verifies user permissions based on roles
- Handles loading states during authentication checks

### Usage

```jsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRoles={['admin']}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

## User Profile Management

The authentication system includes components for viewing and updating user profiles:

- `UserProfile.jsx` - Displays user information and allows profile updates
- Authentication state including provider information, email verification status, etc.

## Environment Configuration

The following environment variables are required:

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_firebase_app_id

# OAuth Providers
REACT_APP_APPLE_CLIENT_ID=your_apple_client_id
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

## Security Considerations

1. **Token Validation**: All tokens received from OAuth providers are validated on the backend.
2. **Secure Storage**: Authentication tokens are stored securely and not exposed to client-side JavaScript.
3. **HTTPS Only**: All authentication endpoints require HTTPS.
4. **Role-based Access Control**: Routes are protected based on user roles.
5. **Email Verification**: Users can be required to verify their email addresses before accessing certain features.

## Testing

Unit tests are provided for the authentication components:

- `__tests__/utils/appleAuth.test.js` - Tests for Apple authentication utilities
- `__tests__/components/AppleSignInButton.test.js` - Tests for the Apple Sign In button

## Future Improvements

1. Multi-factor authentication support
2. Additional OAuth providers (Facebook, Twitter, GitHub, etc.)
3. Enhanced role and permission management
4. Account linking between multiple providers
5. Password reset and account recovery workflows

## References

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Apple Sign in with Apple Documentation](https://developer.apple.com/documentation/sign_in_with_apple)
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/web)
- [Microsoft Authentication Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview)
