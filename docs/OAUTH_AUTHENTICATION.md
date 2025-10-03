# OAuth Authentication Implementation

This document provides an overview of the OAuth authentication implementation in Windgap Academy.

## Implemented OAuth Providers

- **Google**: Implemented using Firebase Authentication with GoogleAuthProvider
- **Microsoft**: Implemented using Firebase Authentication with OAuthProvider for Microsoft
- **Apple**: Implemented using Firebase Authentication with AppleAuthProvider
- **Facebook**: Implemented using Firebase Authentication with FacebookAuthProvider

## Architecture

The authentication system consists of the following key components:

### 1. Authentication Context

Location: `/src/context/AuthContext.jsx`

Provides authentication state management and methods for the entire application through React Context API. Includes methods for:

- Email/password authentication
- OAuth provider authentication
- User role management
- Permission-based access control
- Multi-factor authentication (MFA)

### 2. Provider-Specific Implementations

- **Microsoft Authentication**: `/src/utils/microsoftAuth.js`
  - Configures Microsoft OAuth provider
  - Handles token management
  - Stores user data in Firestore
  - Provides methods for accessing Microsoft Graph API

### 3. Authentication UI Components

- **OAuthSignIn**: `/components/OAuthSignIn.jsx`
  - Unified component for OAuth sign-in with multiple providers
  - Supports different layouts (vertical, horizontal, grid)
  - Handles authentication flow and error states

- **MicrosoftSignInButton**: `/components/MicrosoftSignInButton.jsx`
  - Dedicated button for Microsoft authentication
  - Supports different styling variants

### 4. Sample Implementation

- **LoginPage**: `/pages/LoginPage.jsx`
  - Demonstrates the usage of OAuth authentication components
  - Shows user profile information after successful login

## Setup Requirements

Before using the OAuth authentication system, you must:

1. Register your application with each provider:
   - [Google Cloud Console](https://console.cloud.google.com/)
   - [Microsoft Azure Portal](https://portal.azure.com/)
   - [Apple Developer Program](https://developer.apple.com/)
   - [Facebook for Developers](https://developers.facebook.com/)

2. Configure Firebase Authentication with your provider credentials

3. Set up environment variables (see `.env.example`):
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   MICROSOFT_CLIENT_ID=your_microsoft_client_id
   APPLE_CLIENT_ID=your_apple_client_id
   FACEBOOK_CLIENT_ID=your_facebook_client_id
   ```

## Usage

### Basic Implementation

```jsx
import { useAuth } from "../src/context/AuthContext";
import OAuthSignIn from "../components/OAuthSignIn";

function MyLoginComponent() {
  const { currentUser } = useAuth();

  const handleLoginSuccess = (user) => {
    console.log("User logged in:", user);
  };

  const handleLoginError = (error) => {
    console.error("Login error:", error);
  };

  return (
    <div>
      {currentUser ? (
        <div>Welcome, {currentUser.displayName}!</div>
      ) : (
        <OAuthSignIn
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          providers={["google", "microsoft", "apple"]}
        />
      )}
    </div>
  );
}
```

### Microsoft-Only Implementation

```jsx
import { useAuth } from "../src/context/AuthContext";
import MicrosoftSignInButton from "../components/MicrosoftSignInButton";

function MicrosoftLoginComponent() {
  const handleSuccess = (user) => {
    console.log("Microsoft login successful:", user);
  };

  return <MicrosoftSignInButton onSuccess={handleSuccess} variant="large" />;
}
```

## Security Considerations

- OAuth access tokens are stored in Firestore with proper security rules
- Sensitive operations require additional verification
- User permissions are enforced at both client and server levels
- Regular token rotation is implemented for long-lived sessions

## Future Improvements

- [ ] Implement refresh token handling for long-lived sessions
- [ ] Add support for additional OAuth providers (GitHub, Twitter)
- [ ] Enhance MFA options with app-based authenticators
- [ ] Create admin interface for managing user roles and permissions
