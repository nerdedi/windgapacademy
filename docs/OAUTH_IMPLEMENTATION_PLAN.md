# Authentication & Identity Integration Plan for Windgap Academy

## Overview

This implementation plan outlines the process for integrating multiple OAuth providers (Google, Microsoft, Apple) into the Windgap Academy platform, enhancing user authentication options and simplifying the login process.

## Benefits

- **Simplified Access**: Users can login with existing accounts
- **Increased Security**: Leverage industry-standard OAuth security
- **Reduced Friction**: Eliminate need for separate username/password
- **Higher Conversion**: Reduce account creation abandonment
- **Enhanced User Data**: Access to profile information (with consent)

## Architecture

We'll implement the authentication system using the following architecture:

1. **Frontend Authentication Components**:
   - OAuth button components
   - Auth state management
   - Protected routes

2. **Backend Authentication Services**:
   - OAuth provider integration
   - Token validation
   - User profile management

3. **Database Schema Enhancements**:
   - OAuth provider fields
   - Connected accounts management
   - User role integration

## Implementation Steps

### Phase 1: Setup & Configuration (Week 1)

#### 1.1 Provider Registration

- Register Windgap Academy with each OAuth provider:
  - [Google Cloud Console](https://console.cloud.google.com/)
  - [Microsoft Azure Portal](https://portal.azure.com/)
  - [Apple Developer Program](https://developer.apple.com/)

#### 1.2 Environment Configuration

- Create and secure environment variables:
  ```
  GOOGLE_CLIENT_ID=your_google_client_id
  GOOGLE_CLIENT_SECRET=your_google_client_secret
  MICROSOFT_CLIENT_ID=your_microsoft_client_id
  MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
  APPLE_CLIENT_ID=your_apple_client_id
  APPLE_TEAM_ID=your_apple_team_id
  APPLE_KEY_ID=your_apple_key_id
  APPLE_PRIVATE_KEY=your_apple_private_key
  ```

#### 1.3 Database Schema Updates

- Add provider fields to user model:
  ```javascript
  // Example schema extension
  const userSchema = {
    // Existing fields...
    authProviders: {
      google: {
        id: String,
        email: String,
        name: String,
        picture: String,
        accessToken: String, // Consider encryption
        refreshToken: String, // Consider encryption
      },
      microsoft: {
        // Similar structure
      },
      apple: {
        // Similar structure
      },
    },
    // Other fields...
  };
  ```

### Phase 2: Backend Implementation (Week 2)

#### 2.1 Install Dependencies

```bash
npm install passport passport-google-oauth20 passport-microsoft passport-apple
```

#### 2.2 Configure Passport Strategies

```javascript
// /backend/middleware/auth.js

import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import MicrosoftStrategy from "passport-microsoft";
import AppleStrategy from "passport-apple";
import { findUserByProviderId, createUserFromOAuth } from "../services/userService";

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create user based on Google ID
        let user = await findUserByProviderId("google", profile.id);

        if (!user) {
          // Create new user from Google profile
          user = await createUserFromOAuth("google", profile, accessToken, refreshToken);
        } else {
          // Update existing user's tokens
          await updateUserTokens("google", user.id, accessToken, refreshToken);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// Similar configuration for Microsoft and Apple strategies
// ...
```

#### 2.3 Create Authentication Routes

```javascript
// /backend/routes/auth.js

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

// Google Authentication Routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, roles: req.user.roles },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Redirect to frontend with token
    res.redirect(`/auth-callback?token=${token}`);
  },
);

// Similar routes for Microsoft and Apple
// ...

// Token verification middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No authentication token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default router;
```

#### 2.4 Implement User Service

```javascript
// /backend/services/userService.js

import User from "../models/User";

export const findUserByProviderId = async (provider, providerId) => {
  return await User.findOne({ [`authProviders.${provider}.id`]: providerId });
};

export const createUserFromOAuth = async (provider, profile, accessToken, refreshToken) => {
  const newUser = {
    email: profile.emails[0].value,
    name: profile.displayName,
    authProviders: {
      [provider]: {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value,
        accessToken,
        refreshToken,
      },
    },
    roles: ["student"], // Default role
  };

  return await User.create(newUser);
};

export const updateUserTokens = async (provider, userId, accessToken, refreshToken) => {
  return await User.findByIdAndUpdate(userId, {
    [`authProviders.${provider}.accessToken`]: accessToken,
    [`authProviders.${provider}.refreshToken`]: refreshToken,
  });
};
```

### Phase 3: Frontend Implementation (Week 3)

#### 3.1 Create Authentication Context

```javascript
// /src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");

    if (token) {
      // Verify token with backend
      fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error("Invalid token");
        })
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleOAuthCallback = (token) => {
    if (token) {
      localStorage.setItem("token", token);

      // Decode token to get basic user info
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const userData = JSON.parse(window.atob(base64));
        setUser(userData);
      } catch (error) {
        console.error("Error parsing token", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, handleOAuthCallback }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

#### 3.2 Create OAuth Button Components

```javascript
// /components/auth/OAuthButtons.jsx

import React from "react";
import { Box, Button, VStack, Text, Icon } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { AiFillApple } from "react-icons/ai";

const OAuthButtons = () => {
  const handleOAuthLogin = (provider) => {
    window.location.href = `/api/auth/${provider}`;
  };

  return (
    <VStack spacing={4} width="100%">
      <Text fontWeight="medium">Continue with:</Text>

      <Button
        leftIcon={<Icon as={FcGoogle} boxSize={5} />}
        onClick={() => handleOAuthLogin("google")}
        width="100%"
        variant="outline"
      >
        Google
      </Button>

      <Button
        leftIcon={<Icon as={FaMicrosoft} color="#00A4EF" boxSize={5} />}
        onClick={() => handleOAuthLogin("microsoft")}
        width="100%"
        variant="outline"
      >
        Microsoft
      </Button>

      <Button
        leftIcon={<Icon as={AiFillApple} boxSize={5} />}
        onClick={() => handleOAuthLogin("apple")}
        width="100%"
        variant="outline"
      >
        Apple
      </Button>
    </VStack>
  );
};

export default OAuthButtons;
```

#### 3.3 Create Login Page

```javascript
// /pages/login.jsx

import React from "react";
import { Container, Box, Heading, Text, VStack, Divider } from "@chakra-ui/react";
import OAuthButtons from "../components/auth/OAuthButtons";
import EmailPasswordForm from "../components/auth/EmailPasswordForm"; // Existing login form

const LoginPage = () => {
  return (
    <Container maxW="md" py={12}>
      <Box padding={8} bg="white" boxShadow="md" borderRadius="md">
        <VStack spacing={6}>
          <Heading as="h1" size="xl">
            Welcome Back
          </Heading>
          <Text color="gray.600">Sign in to continue to Windgap Academy</Text>

          <EmailPasswordForm />

          <Box width="100%" position="relative" padding="10px 0">
            <Divider />
            <Text
              position="absolute"
              top="0"
              bg="white"
              px={3}
              left="50%"
              transform="translateX(-50%) translateY(-50%)"
            >
              or
            </Text>
          </Box>

          <OAuthButtons />
        </VStack>
      </Box>
    </Container>
  );
};

export default LoginPage;
```

#### 3.4 Create OAuth Callback Page

```javascript
// /pages/auth-callback.jsx

import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { Box, Spinner, Center, Text } from "@chakra-ui/react";

const AuthCallbackPage = () => {
  const router = useRouter();
  const { handleOAuthCallback } = useAuth();

  useEffect(() => {
    if (router.query.token) {
      handleOAuthCallback(router.query.token);
      router.push("/dashboard");
    }
  }, [router.query, handleOAuthCallback, router]);

  return (
    <Center height="100vh">
      <Box textAlign="center">
        <Spinner size="xl" mb={4} />
        <Text>Completing authentication...</Text>
      </Box>
    </Center>
  );
};

export default AuthCallbackPage;
```

#### 3.5 Create Protected Route Component

```javascript
// /components/auth/ProtectedRoute.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { Center, Spinner } from "@chakra-ui/react";

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  // Not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  // Role check
  if (requiredRoles.length > 0 && !requiredRoles.some((role) => user.roles.includes(role))) {
    router.push("/unauthorized");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### Phase 4: Testing & Integration (Week 4)

#### 4.1 Manual Testing Plan

1. **Registration Testing**:
   - Test registration with each provider
   - Verify user data is correctly stored
   - Test error handling scenarios

2. **Login Testing**:
   - Test login with each provider
   - Verify token generation and storage
   - Test session persistence

3. **Authorization Testing**:
   - Test protected routes
   - Test role-based access
   - Test token expiration

4. **Integration Testing**:
   - Test integration with existing Windgap systems
   - Verify compatibility with Unity WebGL components
   - Test on various browsers and devices

#### 4.2 Automated Testing

```javascript
// /src/__tests__/auth/OAuthFlow.test.js

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../../context/AuthContext";
import OAuthButtons from "../../components/auth/OAuthButtons";

// Mock window.location
const mockWindowLocation = {
  href: window.location.href,
};

Object.defineProperty(window, "location", {
  value: mockWindowLocation,
  writable: true,
});

describe("OAuth Authentication Flow", () => {
  test("Google OAuth button redirects to correct endpoint", () => {
    render(
      <AuthProvider>
        <OAuthButtons />
      </AuthProvider>,
    );

    const googleButton = screen.getByText("Google");
    fireEvent.click(googleButton);

    expect(window.location.href).toBe("/api/auth/google");
  });

  // Similar tests for other providers
});
```

### Phase 5: Deployment & Documentation (Week 5)

#### 5.1 Update Environment Variables in Production

- Ensure all required environment variables are set in production environments
- Use secure secrets management for OAuth keys

#### 5.2 Documentation

- Create developer documentation
- Update user documentation
- Create troubleshooting guide

#### 5.3 Monitoring

- Set up monitoring for authentication failures
- Track OAuth conversion metrics
- Monitor token usage and security

## Resources

### Library Documentation

- [Passport.js](http://www.passportjs.org/)
- [React Context API](https://reactjs.org/docs/context.html)
- [JWT](https://jwt.io/)

### Provider Documentation

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)
