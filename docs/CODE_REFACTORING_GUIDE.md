# Windgap Academy Code Refactoring Guide

This guide provides a comprehensive approach to refactoring the Windgap Academy codebase, focusing on best practices for creating maintainable, scalable, and high-quality code.

## Table of Contents

1. [Modularization and Separation of Concerns](#1-modularization-and-separation-of-concerns)
2. [Refactoring and Code Quality](#2-refactoring-and-code-quality)
3. [Testing and Automation](#3-testing-and-automation)
4. [Documentation and Communication](#4-documentation-and-communication)
5. [Design Principles and Patterns](#5-design-principles-and-patterns)
6. [Incremental Changes](#6-incremental-changes)
7. [Tools and Scripts](#7-tools-and-scripts)
8. [Implementation Plan](#8-implementation-plan)

## 1. Modularization and Separation of Concerns

### Breaking Down Large Components

**Current Issues:**

- Components exceeding 300 lines of code
- Functions with multiple responsibilities
- Components handling UI, state management, and data fetching

**Target Solution:**

- Limit components to 200 lines of code
- Each function should have a single responsibility
- Separate concerns: UI rendering, data fetching, state management

**Implementation Steps:**

1. **Extract Presentation Components:**

   ```jsx
   // Before: Mixed concerns
   function UserDashboard() {
     const [userData, setUserData] = useState(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
       fetchUserData().then((data) => {
         setUserData(data);
         setIsLoading(false);
       });
     }, []);

     return (
       <div className="dashboard">
         {isLoading ? (
           <LoadingSpinner />
         ) : (
           <div>
             <h1>{userData.name}'s Dashboard</h1>
             <UserStats stats={userData.stats} />
             <RecentActivity activities={userData.activities} />
           </div>
         )}
       </div>
     );
   }

   // After: Separation of concerns
   // UserDashboardContainer.jsx - Data and state management
   function UserDashboardContainer() {
     const { userData, isLoading } = useUserData(); // Custom hook for data fetching
     return <UserDashboard userData={userData} isLoading={isLoading} />;
   }

   // UserDashboard.jsx - Presentation only
   function UserDashboard({ userData, isLoading }) {
     return (
       <div className="dashboard">
         {isLoading ? (
           <LoadingSpinner />
         ) : (
           <div>
             <h1>{userData.name}'s Dashboard</h1>
             <UserStats stats={userData.stats} />
             <RecentActivity activities={userData.activities} />
           </div>
         )}
       </div>
     );
   }
   ```

2. **Create Custom Hooks:**
   Extract logic for data fetching, state management, and complex calculations into custom hooks.

   ```jsx
   // useUserData.js
   function useUserData() {
     const [userData, setUserData] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
       let isMounted = true;

       async function fetchData() {
         try {
           const data = await fetchUserData();
           if (isMounted) {
             setUserData(data);
             setIsLoading(false);
           }
         } catch (err) {
           if (isMounted) {
             setError(err);
             setIsLoading(false);
           }
         }
       }

       fetchData();
       return () => {
         isMounted = false;
       };
     }, []);

     return { userData, isLoading, error };
   }
   ```

3. **Create Service Modules:**
   Move API calls and data processing into dedicated service modules.

   ```js
   // userService.js
   export async function fetchUserData(userId) {
     const response = await fetch(`/api/users/${userId}`);
     if (!response.ok) {
       throw new Error("Failed to fetch user data");
     }
     return response.json();
   }

   export async function updateUserPreferences(userId, preferences) {
     const response = await fetch(`/api/users/${userId}/preferences`, {
       method: "PUT",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(preferences),
     });
     if (!response.ok) {
       throw new Error("Failed to update preferences");
     }
     return response.json();
   }
   ```

### Encapsulation

1. **Create Class-based Modules:**

   ```js
   // MathExerciseEngine.js
   class MathExerciseEngine {
     constructor(difficultyLevel, exerciseType) {
       this.difficultyLevel = difficultyLevel;
       this.exerciseType = exerciseType;
       this.exercises = [];
       this.currentIndex = 0;
     }

     // Public methods (interface)
     generateExercises(count) {
       this.exercises = [];
       for (let i = 0; i < count; i++) {
         this.exercises.push(this._createExercise());
       }
       return this.exercises;
     }

     getCurrentExercise() {
       return this.exercises[this.currentIndex];
     }

     moveToNextExercise() {
       if (this.currentIndex < this.exercises.length - 1) {
         this.currentIndex++;
         return this.getCurrentExercise();
       }
       return null;
     }

     // Private methods (implementation details)
     _createExercise() {
       // Implementation details hidden from consumers
       switch (this.exerciseType) {
         case "addition":
           return this._generateAdditionExercise();
         case "subtraction":
           return this._generateSubtractionExercise();
         case "multiplication":
           return this._generateMultiplicationExercise();
         default:
           return this._generateAdditionExercise();
       }
     }

     _generateAdditionExercise() {
       // Implementation details
     }

     _generateSubtractionExercise() {
       // Implementation details
     }

     _generateMultiplicationExercise() {
       // Implementation details
     }
   }

   export default MathExerciseEngine;
   ```

2. **Use TypeScript Interfaces:**

   ```typescript
   // models/User.ts
   export interface User {
     id: string;
     name: string;
     email: string;
     role: "student" | "teacher" | "admin";
     preferences: UserPreferences;
   }

   export interface UserPreferences {
     theme: "light" | "dark" | "system";
     notifications: boolean;
     accessibility: AccessibilitySettings;
   }

   export interface AccessibilitySettings {
     fontSize: number;
     highContrast: boolean;
     reduceMotion: boolean;
   }
   ```

### Loose Coupling

1. **Dependency Injection:**

   ```jsx
   // Before: Tight coupling
   function UserProfile() {
     const userData = fetchUserDataFromAPI(); // Direct API dependency
     return <div>{userData.name}</div>;
   }

   // After: Dependency injection
   function UserProfile({ userData }) {
     // Accepts data as prop
     return <div>{userData.name}</div>;
   }

   // Usage
   function Container() {
     const userData = fetchUserDataFromAPI();
     return <UserProfile userData={userData} />;
   }
   ```

2. **Use Context API for Cross-Cutting Concerns:**

   ```jsx
   // AuthContext.js
   const AuthContext = createContext(null);

   export function AuthProvider({ children }) {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       // Auth logic here
       firebase.auth().onAuthStateChanged((user) => {
         setUser(user);
         setLoading(false);
       });
     }, []);

     const value = {
       user,
       loading,
       signIn: (email, password) => firebase.auth().signInWithEmailAndPassword(email, password),
       signOut: () => firebase.auth().signOut(),
     };

     return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
   }

   export function useAuth() {
     return useContext(AuthContext);
   }
   ```

3. **Event-Based Communication:**

   ```js
   // eventBus.js
   class EventBus {
     constructor() {
       this.events = {};
     }

     subscribe(event, callback) {
       if (!this.events[event]) {
         this.events[event] = [];
       }
       this.events[event].push(callback);

       return () => {
         this.events[event] = this.events[event].filter((cb) => cb !== callback);
       };
     }

     publish(event, data) {
       if (!this.events[event]) {
         return;
       }
       this.events[event].forEach((callback) => {
         callback(data);
       });
     }
   }

   export default new EventBus();
   ```

## 2. Refactoring and Code Quality

### Identifying and Addressing Code Smells

**Tools Configuration:**

1. **ESLint Rules:**

   ```js
   // .eslintrc.js
   module.exports = {
     extends: ["eslint:recommended", "plugin:react/recommended", "plugin:react-hooks/recommended"],
     plugins: ["react", "react-hooks"],
     rules: {
       complexity: ["error", { max: 10 }], // Limit cyclomatic complexity
       "max-lines-per-function": ["warn", { max: 50 }],
       "max-depth": ["warn", { max: 3 }],
       "max-nested-callbacks": ["warn", { max: 3 }],
       "no-duplicate-imports": "error",
       "no-unused-vars": [
         "error",
         {
           vars: "all",
           args: "after-used",
           ignoreRestSiblings: true,
         },
       ],
     },
   };
   ```

2. **Code Quality Metrics:**
   Configure tools like SonarQube or CodeClimate to track metrics like:
   - Cyclomatic Complexity
   - Cognitive Complexity
   - Method Length
   - Class Size
   - Comment Density
   - Duplication Density

**Common Code Smells and Solutions:**

1. **Long Method:**
   - Symptom: Functions longer than 30 lines
   - Solution: Extract Method refactoring

   ```jsx
   // Before
   function handleSubmit() {
     // 50 lines of form validation, data processing, and API calls
   }

   // After
   function handleSubmit() {
     const formData = validateForm();
     if (formData) {
       const processedData = processFormData(formData);
       submitToApi(processedData);
     }
   }

   function validateForm() {
     // Form validation logic
   }

   function processFormData(formData) {
     // Data processing logic
   }

   function submitToApi(data) {
     // API submission logic
   }
   ```

2. **Large Class/Component:**
   - Symptom: Component with many state variables and methods
   - Solution: Extract Class/Component refactoring

   Break components into smaller, focused components with clear responsibilities.

3. **Duplicate Code:**
   - Symptom: Similar code in multiple places
   - Solution: Extract shared functionality

   ```jsx
   // Before: Duplicated in multiple components
   function ComponentA() {
     return (
       <div className="card shadow-md rounded-lg p-4 bg-white">
         <h2 className="text-xl font-bold text-gray-800">Component A</h2>
         {/* Component content */}
       </div>
     );
   }

   function ComponentB() {
     return (
       <div className="card shadow-md rounded-lg p-4 bg-white">
         <h2 className="text-xl font-bold text-gray-800">Component B</h2>
         {/* Component content */}
       </div>
     );
   }

   // After: Extract shared component
   function Card({ title, children }) {
     return (
       <div className="card shadow-md rounded-lg p-4 bg-white">
         <h2 className="text-xl font-bold text-gray-800">{title}</h2>
         {children}
       </div>
     );
   }

   function ComponentA() {
     return <Card title="Component A">{/* Component content */}</Card>;
   }

   function ComponentB() {
     return <Card title="Component B">{/* Component content */}</Card>;
   }
   ```

### Consistent Coding Style

**Setup:**

1. **Prettier Configuration:**

   ```js
   // .prettierrc
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "printWidth": 80,
     "tabWidth": 2,
     "endOfLine": "auto",
     "arrowParens": "avoid"
   }
   ```

2. **EditorConfig:**

   ```
   # .editorconfig
   root = true

   [*]
   indent_style = space
   indent_size = 2
   end_of_line = lf
   charset = utf-8
   trim_trailing_whitespace = true
   insert_final_newline = true

   [*.md]
   trim_trailing_whitespace = false
   ```

3. **Pre-commit Hooks:**

   ```bash
   # Install husky and lint-staged
   npm install --save-dev husky lint-staged

   # In package.json
   {
     "husky": {
       "hooks": {
         "pre-commit": "lint-staged"
       }
     },
     "lint-staged": {
       "*.{js,jsx,ts,tsx}": [
         "eslint --fix",
         "prettier --write"
       ],
       "*.{json,css,scss,md}": [
         "prettier --write"
       ]
     }
   }
   ```

### Meaningful Naming

**Guidelines:**

1. **Components:**
   - Use PascalCase
   - Name should reflect purpose
   - Avoid abbreviations

   ```jsx
   // Bad
   function SBtn() {} // Abbreviated
   function Component1() {} // Meaningless

   // Good
   function SubmitButton() {}
   function StudentRegistrationForm() {}
   ```

2. **Functions:**
   - Use camelCase
   - Begin with verb for actions
   - Be descriptive yet concise

   ```jsx
   // Bad
   function data() {}
   function handleIt() {}

   // Good
   function fetchUserData() {}
   function validateFormInput() {}
   ```

3. **Variables:**
   - Use camelCase
   - Be descriptive
   - Use meaningful distinctions

   ```jsx
   // Bad
   const d = new Date(); // Single letter
   const data1 = {}; // Numbered
   const userData = {};
   const usrInfo = {}; // Inconsistent naming

   // Good
   const currentDate = new Date();
   const activeUserData = {};
   const pendingUserData = {};
   ```

### Eliminating Duplication

1. **DRY (Don't Repeat Yourself):**
   - Extract repeated JSX into reusable components
   - Extract repeated logic into utility functions or custom hooks
   - Use composition patterns

2. **Helper Functions:**

   ```jsx
   // utils/dateHelpers.js
   export function formatDate(date, format = "MM/DD/YYYY") {
     // Date formatting implementation
   }

   export function getRelativeTimeString(date) {
     // Relative time implementation (e.g., "5 minutes ago")
   }

   // Usage in components
   import { formatDate, getRelativeTimeString } from "../utils/dateHelpers";
   ```

3. **Higher-Order Components:**

   ```jsx
   // withErrorBoundary.jsx
   function withErrorBoundary(WrappedComponent) {
     return function WithErrorBoundary(props) {
       const [hasError, setHasError] = useState(false);

       useEffect(() => {
         function handleError(error) {
           console.error(error);
           setHasError(true);
         }

         window.addEventListener("error", handleError);
         return () => window.removeEventListener("error", handleError);
       }, []);

       if (hasError) {
         return <ErrorFallback />;
       }

       return <WrappedComponent {...props} />;
     };
   }
   ```

### Minimizing Dependencies

**Strategies:**

1. **Audit Dependencies:**

   ```bash
   npm audit
   npx depcheck
   ```

2. **Evaluate Before Adding:**
   Before adding a new package, consider:
   - Size and impact on bundle
   - Maintenance status and community support
   - Alternative implementations with fewer dependencies
   - Can it be implemented in-house with reasonable effort?

3. **Use tree-shaking friendly imports:**

   ```jsx
   // Bad (imports entire library)
   import lodash from "lodash";

   // Good (imports only what's needed)
   import debounce from "lodash/debounce";
   ```

## 3. Testing and Automation

### Implementing Automated Tests

**Testing Strategy:**

1. **Unit Tests:**
   Focus on testing isolated units of code (functions, components, hooks).

   ```jsx
   // Example Jest test for a utility function
   import { calculateTotalScore } from "../utils/scoreUtils";

   describe("calculateTotalScore", () => {
     it("should return 0 for empty arrays", () => {
       expect(calculateTotalScore([])).toBe(0);
     });

     it("should sum all scores correctly", () => {
       const scores = [10, 25, 40, 15];
       expect(calculateTotalScore(scores)).toBe(90);
     });

     it("should handle negative scores", () => {
       const scores = [10, -5, 15];
       expect(calculateTotalScore(scores)).toBe(20);
     });
   });
   ```

2. **Component Tests:**
   Test component rendering and interactions.

   ```jsx
   // Example React Testing Library test
   import { render, screen, fireEvent } from "@testing-library/react";
   import Counter from "../components/Counter";

   describe("Counter component", () => {
     it("should render with initial count of 0", () => {
       render(<Counter />);
       expect(screen.getByText("Count: 0")).toBeInTheDocument();
     });

     it("should increment count when increment button is clicked", () => {
       render(<Counter />);
       fireEvent.click(screen.getByText("Increment"));
       expect(screen.getByText("Count: 1")).toBeInTheDocument();
     });

     it("should decrement count when decrement button is clicked", () => {
       render(<Counter />);
       fireEvent.click(screen.getByText("Increment"));
       fireEvent.click(screen.getByText("Decrement"));
       expect(screen.getByText("Count: 0")).toBeInTheDocument();
     });
   });
   ```

3. **Integration Tests:**
   Test how components work together.

   ```jsx
   // Example integration test
   import { render, screen, fireEvent, waitFor } from "@testing-library/react";
   import UserProfile from "../components/UserProfile";
   import { AuthProvider } from "../context/AuthContext";

   describe("UserProfile integration", () => {
     it("should display user information when logged in", async () => {
       render(
         <AuthProvider>
           <UserProfile />
         </AuthProvider>,
       );

       // Simulate login
       fireEvent.click(screen.getByText("Log In"));
       fireEvent.change(screen.getByLabelText("Email"), {
         target: { value: "test@example.com" },
       });
       fireEvent.change(screen.getByLabelText("Password"), {
         target: { value: "password123" },
       });
       fireEvent.click(screen.getByText("Submit"));

       // Wait for profile to load
       await waitFor(() => {
         expect(screen.getByText("Welcome, Test User")).toBeInTheDocument();
       });
     });
   });
   ```

4. **End-to-End Tests:**
   Test complete user flows.

   ```js
   // Example Playwright test
   const { test, expect } = require("@playwright/test");

   test("user can log in and access dashboard", async ({ page }) => {
     await page.goto("https://example.com");
     await page.fill('input[name="email"]', "user@example.com");
     await page.fill('input[name="password"]', "password123");
     await page.click('button[type="submit"]');

     // Verify user is redirected to dashboard
     await expect(page).toHaveURL(/dashboard/);
     await expect(page.locator("h1")).toContainText("Dashboard");

     // Verify user-specific content is loaded
     await expect(page.locator(".user-greeting")).toContainText("Welcome back");
   });
   ```

5. **Test Coverage Goals:**
   - Unit tests: 80%+ coverage
   - Component tests: Cover all user interactions
   - Integration tests: Cover critical paths
   - E2E tests: Cover main user flows

### CI/CD Setup

**GitHub Actions Configuration:**

```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "16"
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "16"
      - run: npm ci
      - run: npm test
      - uses: codecov/codecov-action@v2
        with:
          token: ${{ secrets.CODECOV_TOKEN }}

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "16"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: build/

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: [build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: build/
      - name: Deploy to staging
        run: # Deployment steps for staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: build-artifacts
          path: build/
      - name: Deploy to production
        run: # Deployment steps for production
```

## 4. Documentation and Communication

### Readable Code

**Principles:**

1. **Clear Structure:**
   - Organize code logically
   - Group related functionality
   - Use consistent patterns

2. **Meaningful Comments:**
   - Comment "why", not "what"
   - Document non-obvious decisions
   - Keep comments up-to-date

   ```jsx
   // Bad: Explains what the code does (obvious from reading)
   // This function adds two numbers
   function add(a, b) {
     return a + b;
   }

   // Good: Explains rationale or constraints
   // Using integer division to ensure whole number result
   // as decimal results cause display issues in the graph
   function calculateAverageItems(totalItems, days) {
     return Math.floor(totalItems / days);
   }
   ```

3. **Self-Documenting Code:**
   - Use descriptive variable and function names
   - Extract complex conditions to named functions
   - Keep functions small and focused

   ```jsx
   // Before
   if (u.s === "a" && u.p && Date.now() - u.t < 3600000) {
     // Do something
   }

   // After
   function isActiveUserWithValidSession(user) {
     const ONE_HOUR_MS = 3600000;
     return (
       user.status === "active" && user.premium && Date.now() - user.lastLoginTime < ONE_HOUR_MS
     );
   }

   if (isActiveUserWithValidSession(user)) {
     // Do something
   }
   ```

### Strategic Documentation

**Documentation Types:**

1. **Code Documentation:**
   - Use JSDoc for functions and classes

   ```jsx
   /**
    * Calculates the grade based on a score and maximum possible score.
    *
    * @param {number} score - The actual score received
    * @param {number} maxScore - The maximum possible score
    * @returns {string} The letter grade (A, B, C, D, or F)
    * @throws {Error} If score is negative or greater than maxScore
    * @example
    * calculateGrade(85, 100); // Returns "B"
    */
   function calculateGrade(score, maxScore) {
     // Implementation
   }
   ```

2. **Architecture Documentation:**
   - Create high-level diagrams for system architecture
   - Document major components and their interactions
   - Use tools like Mermaid.js for diagrams in Markdown

   ````markdown
   # Authentication System

   ```mermaid
   sequenceDiagram
       User->>+Frontend: Enter credentials
       Frontend->>+Auth API: Request token
       Auth API->>+Database: Verify credentials
       Database-->>-Auth API: User exists
       Auth API-->>-Frontend: JWT Token
       Frontend-->>-User: Redirect to dashboard
   ```
   ````

   ```

   ```

3. **README Documentation:**
   - Project overview
   - Setup instructions
   - Available scripts
   - Architecture overview
   - Contribution guidelines

4. **API Documentation:**
   - Document all endpoints
   - Include request/response examples
   - Note authentication requirements
   - Document error responses

### Knowledge Sharing

**Strategies:**

1. **Code Reviews:**
   - Focus on knowledge transfer
   - Ask questions rather than dictate changes
   - Explain rationale for suggestions

2. **Pair Programming:**
   - Schedule regular sessions
   - Mix experience levels
   - Rotate roles (driver/navigator)

3. **Tech Talks:**
   - Share insights about complex parts of the system
   - Present new technologies or approaches
   - Record sessions for future reference

## 5. Design Principles and Patterns

### SOLID Principles

1. **Single Responsibility Principle:**
   Each class or component should have only one reason to change.

   ```jsx
   // Before: Mixed responsibilities
   function UserProfile({ userId }) {
     const [user, setUser] = useState(null);

     useEffect(() => {
       fetch(`/api/users/${userId}`)
         .then((res) => res.json())
         .then((data) => setUser(data));
     }, [userId]);

     if (!user) return <Loading />;

     return (
       <div>
         <h1>{user.name}</h1>
         <p>{user.email}</p>
         {/* UI rendering */}
       </div>
     );
   }

   // After: Separation of responsibilities
   // UserData.jsx - Data fetching
   function useUserData(userId) {
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       fetch(`/api/users/${userId}`)
         .then((res) => res.json())
         .then((data) => {
           setUser(data);
           setLoading(false);
         });
     }, [userId]);

     return { user, loading };
   }

   // UserProfile.jsx - Presentation
   function UserProfile({ userId }) {
     const { user, loading } = useUserData(userId);

     if (loading) return <Loading />;

     return (
       <div>
         <h1>{user.name}</h1>
         <p>{user.email}</p>
         {/* UI rendering */}
       </div>
     );
   }
   ```

2. **Open/Closed Principle:**
   Software entities should be open for extension but closed for modification.

   ```jsx
   // Before: Hard-coded notification types
   function NotificationSystem() {
     function sendNotification(type, message) {
       if (type === "email") {
         // Send email
       } else if (type === "sms") {
         // Send SMS
       } else if (type === "push") {
         // Send push notification
       }
     }

     return { sendNotification };
   }

   // After: Open for extension
   // Base interface/class
   class NotificationChannel {
     send(message) {
       throw new Error("Method not implemented");
     }
   }

   // Implementations
   class EmailNotification extends NotificationChannel {
     send(message) {
       // Send email
     }
   }

   class SmsNotification extends NotificationChannel {
     send(message) {
       // Send SMS
     }
   }

   class PushNotification extends NotificationChannel {
     send(message) {
       // Send push
     }
   }

   // Factory
   function createNotificationChannel(type) {
     switch (type) {
       case "email":
         return new EmailNotification();
       case "sms":
         return new SmsNotification();
       case "push":
         return new PushNotification();
       default:
         throw new Error(`Unknown notification type: ${type}`);
     }
   }

   // Usage
   function sendNotification(type, message) {
     const channel = createNotificationChannel(type);
     channel.send(message);
   }
   ```

3. **Liskov Substitution Principle:**
   Subtypes must be substitutable for their base types.

   ```jsx
   // Shape hierarchy that follows LSP
   class Shape {
     area() {
       throw new Error("Method not implemented");
     }
   }

   class Rectangle extends Shape {
     constructor(width, height) {
       super();
       this.width = width;
       this.height = height;
     }

     area() {
       return this.width * this.height;
     }
   }

   class Square extends Shape {
     constructor(side) {
       super();
       this.side = side;
     }

     area() {
       return this.side * this.side;
     }
   }

   // Function that works with any Shape
   function printArea(shape) {
     console.log(`Area: ${shape.area()}`);
   }

   // Both work correctly
   printArea(new Rectangle(5, 10)); // "Area: 50"
   printArea(new Square(5)); // "Area: 25"
   ```

4. **Interface Segregation Principle:**
   No client should be forced to depend on methods it does not use.

   ```jsx
   // Before: Monolithic interface
   interface UserInterface {
     getProfile(): UserProfile;
     getOrders(): Order[];
     updateProfile(profile: UserProfile): void;
     placeOrder(order: Order): void;
     trackShipment(orderId: string): Shipment;
     cancelOrder(orderId: string): void;
   }

   // After: Segregated interfaces
   interface UserProfileService {
     getProfile(): UserProfile;
     updateProfile(profile: UserProfile): void;
   }

   interface OrderService {
     getOrders(): Order[];
     placeOrder(order: Order): void;
     cancelOrder(orderId: string): void;
   }

   interface ShipmentService {
     trackShipment(orderId: string): Shipment;
   }

   // Classes can implement only the interfaces they need
   class UserProfileManager implements UserProfileService {
     getProfile() { /* ... */ }
     updateProfile(profile) { /* ... */ }
   }

   class OrderManager implements OrderService {
     getOrders() { /* ... */ }
     placeOrder(order) { /* ... */ }
     cancelOrder(orderId) { /* ... */ }
   }
   ```

5. **Dependency Inversion Principle:**
   High-level modules should not depend on low-level modules. Both should depend on abstractions.

   ```jsx
   // Before: Direct dependency on implementation
   class UserService {
     constructor() {
       this.repository = new MySQLUserRepository(); // Direct dependency
     }

     getUser(id) {
       return this.repository.findById(id);
     }
   }

   // After: Dependency inversion
   // Define interface/abstract class
   class UserRepository {
     findById(id) {
       throw new Error("Method not implemented");
     }
   }

   // Implementations
   class MySQLUserRepository extends UserRepository {
     findById(id) {
       // MySQL implementation
     }
   }

   class MongoUserRepository extends UserRepository {
     findById(id) {
       // MongoDB implementation
     }
   }

   // High-level module depends on abstraction
   class UserService {
     constructor(userRepository) {
       this.repository = userRepository;
     }

     getUser(id) {
       return this.repository.findById(id);
     }
   }

   // Dependency injection
   const service = new UserService(new MySQLUserRepository());
   ```

### Common Design Patterns

1. **Factory Pattern:**

   ```jsx
   // Exercise factory
   class ExerciseFactory {
     static createExercise(type, level) {
       switch (type) {
         case "math":
           return new MathExercise(level);
         case "reading":
           return new ReadingExercise(level);
         case "spelling":
           return new SpellingExercise(level);
         default:
           throw new Error(`Unknown exercise type: ${type}`);
       }
     }
   }

   // Usage
   const exercise = ExerciseFactory.createExercise("math", "intermediate");
   ```

2. **Observer Pattern:**

   ```jsx
   // Using React's Context API to implement Observer pattern
   const LearningProgressContext = createContext();

   function LearningProgressProvider({ children }) {
     const [progress, setProgress] = useState({});
     const [observers, setObservers] = useState([]);

     const registerObserver = (observer) => {
       setObservers((prev) => [...prev, observer]);
     };

     const unregisterObserver = (observer) => {
       setObservers((prev) => prev.filter((obs) => obs !== observer));
     };

     const notifyObservers = () => {
       observers.forEach((observer) => observer(progress));
     };

     const updateProgress = (exerciseId, score) => {
       setProgress((prev) => {
         const newProgress = {
           ...prev,
           [exerciseId]: score,
         };

         // Schedule notification for next tick
         setTimeout(() => notifyObservers(newProgress), 0);

         return newProgress;
       });
     };

     return (
       <LearningProgressContext.Provider
         value={{ progress, updateProgress, registerObserver, unregisterObserver }}
       >
         {children}
       </LearningProgressContext.Provider>
     );
   }
   ```

3. **Strategy Pattern:**

   ```jsx
   // Different strategies for scoring exercises
   class ScoringStrategy {
     calculateScore(answers, solutions) {
       throw new Error("Method not implemented");
     }
   }

   class BinaryScoring extends ScoringStrategy {
     // Right/wrong only
     calculateScore(answers, solutions) {
       let correct = 0;
       for (let i = 0; i < answers.length; i++) {
         if (answers[i] === solutions[i]) correct++;
       }
       return (correct / solutions.length) * 100;
     }
   }

   class PartialCreditScoring extends ScoringStrategy {
     // Partial credit for close answers
     calculateScore(answers, solutions) {
       let totalPoints = 0;
       for (let i = 0; i < answers.length; i++) {
         const closeness = this.calculateCloseness(answers[i], solutions[i]);
         totalPoints += closeness;
       }
       return (totalPoints / solutions.length) * 100;
     }

     calculateCloseness(answer, solution) {
       // Implementation for partial credit
     }
   }

   // Context
   class ExerciseScorer {
     constructor(scoringStrategy) {
       this.scoringStrategy = scoringStrategy;
     }

     setStrategy(scoringStrategy) {
       this.scoringStrategy = scoringStrategy;
     }

     scoreExercise(answers, solutions) {
       return this.scoringStrategy.calculateScore(answers, solutions);
     }
   }

   // Usage
   const scorer = new ExerciseScorer(new BinaryScoring());
   const score = scorer.scoreExercise(studentAnswers, correctSolutions);

   // Change strategy as needed
   scorer.setStrategy(new PartialCreditScoring());
   const detailedScore = scorer.scoreExercise(studentAnswers, correctSolutions);
   ```

4. **Composite Pattern:**

   ```jsx
   // Component interface
   class LearningUnit {
     getTitle() {}
     getDescription() {}
     getDuration() {}
     render() {}
   }

   // Leaf components
   class Exercise extends LearningUnit {
     constructor(title, description, durationMinutes) {
       super();
       this.title = title;
       this.description = description;
       this.durationMinutes = durationMinutes;
     }

     getTitle() {
       return this.title;
     }
     getDescription() {
       return this.description;
     }
     getDuration() {
       return this.durationMinutes;
     }
     render() {
       // Render exercise UI
     }
   }

   class Video extends LearningUnit {
     constructor(title, description, durationMinutes) {
       super();
       this.title = title;
       this.description = description;
       this.durationMinutes = durationMinutes;
     }

     getTitle() {
       return this.title;
     }
     getDescription() {
       return this.description;
     }
     getDuration() {
       return this.durationMinutes;
     }
     render() {
       // Render video player UI
     }
   }

   // Composite component
   class Lesson extends LearningUnit {
     constructor(title, description) {
       super();
       this.title = title;
       this.description = description;
       this.units = [];
     }

     add(unit) {
       this.units.push(unit);
     }

     remove(unit) {
       this.units = this.units.filter((u) => u !== unit);
     }

     getTitle() {
       return this.title;
     }
     getDescription() {
       return this.description;
     }
     getDuration() {
       return this.units.reduce((total, unit) => total + unit.getDuration(), 0);
     }

     render() {
       // Render lesson container with all child units
       return (
         <div className="lesson">
           <h2>{this.getTitle()}</h2>
           <p>{this.getDescription()}</p>
           <p>Duration: {this.getDuration()} minutes</p>
           <div className="units">{this.units.map((unit) => unit.render())}</div>
         </div>
       );
     }
   }

   // Usage
   const mathLesson = new Lesson("Introduction to Fractions", "Learn the basics of fractions");

   mathLesson.add(new Video("Fraction Basics", "Introduction to fractions", 5));
   mathLesson.add(
     new Exercise("Identify Fractions", "Match fractions to visual representations", 10),
   );
   mathLesson.add(new Exercise("Compare Fractions", "Determine which fraction is larger", 15));

   // Composite of composites
   const fractionsCourse = new Lesson(
     "Fractions Mastery",
     "Complete course on working with fractions",
   );

   fractionsCourse.add(mathLesson);
   fractionsCourse.add(new Lesson("Advanced Fractions", "Complex operations with fractions"));

   console.log(fractionsCourse.getDuration()); // Sum of all nested durations
   ```

## 6. Incremental Changes

### Mikado Method

**Implementation:**

1. **Define the Goal:**
   - Set a clear, achievable end state
   - Document the desired outcome in detail
   - Use a diagram to visualize the goal

2. **Create a Mikado Graph:**

   ```
   // Example Mikado Graph
   + Implement User Authentication
     + Create AuthContext
       + Define user state and actions
       + Implement auth hooks
     + Integrate Firebase Auth
       + Setup Firebase config
       + Implement sign-in methods
     + Create protected routes
       + Create PrivateRoute component
       + Update routing configuration
   ```

3. **Build Implementation Plan:**
   - Start with leaf nodes (tasks with no dependencies)
   - Create clear reversal points if changes break functionality
   - Keep commits small and focused
   - Document each step's purpose and expected outcome

4. **Implementation Script:**

   ```bash
   #!/bin/bash

   # Step 1: Create Auth Context
   echo "Creating Auth Context..."
   # Implementation commands

   # Test that everything still works
   npm test

   if [ $? -ne 0 ]; then
     echo "Tests failed. Reverting changes..."
     git reset --hard
     exit 1
   fi

   # Commit the changes
   git add src/context/AuthContext.jsx
   git commit -m "Add Authentication Context"

   # Step 2: Create Auth Hooks
   echo "Creating Auth Hooks..."
   # Implementation commands

   # Continue with similar pattern for each step
   ```

### Small, Frequent Commits

**Best Practices:**

1. **Atomic Commits:**
   - Each commit should represent a single logical change
   - All tests should pass after each commit
   - Include context in commit messages

2. **Commit Message Format:**

   ```
   <type>(<scope>): <short summary>

   <body>

   <footer>
   ```

   **Types:**
   - feat: New feature
   - fix: Bug fix
   - docs: Documentation only changes
   - style: Changes that do not affect code meaning
   - refactor: Code change that neither fixes a bug nor adds a feature
   - perf: Code change that improves performance
   - test: Adding missing tests or correcting existing tests
   - chore: Changes to the build process or auxiliary tools

   **Example:**

   ```
   refactor(auth): extract user profile logic to separate hook

   Extracted user profile fetching logic from UserProfile component
   into a reusable hook for better separation of concerns.

   Closes #123
   ```

3. **Branch Strategy:**
   - Use feature branches for all changes
   - Pull requests should be small and focused
   - Regularly rebase feature branches on main

## 7. Tools and Scripts

### Code Complexity Analysis

Create a script to analyze code complexity:

```bash
#!/bin/bash
# analyze-complexity.sh

echo "Analyzing code complexity..."

# Create output directory
mkdir -p ./reports/complexity

# Run ESLint with complexity plugin
npx eslint src/**/*.{js,jsx,ts,tsx} \
  --rule "complexity: [error, { max: 10 }]" \
  --format json > ./reports/complexity/eslint-complexity.json

# Generate complexity report
echo "Generating complexity report..."
node scripts/generate-complexity-report.js

echo "Analysis complete. Report available at ./reports/complexity/report.html"
```

### Refactoring Helper

Create a script to assist with refactoring:

```bash
#!/bin/bash
# refactor-component.sh

COMPONENT_PATH=$1
TARGET_DIR=$2

if [ -z "$COMPONENT_PATH" ] || [ -z "$TARGET_DIR" ]; then
  echo "Usage: ./refactor-component.sh <component-path> <target-directory>"
  exit 1
fi

COMPONENT_NAME=$(basename "$COMPONENT_PATH" | cut -d. -f1)

# Create directory for the refactored component
mkdir -p "$TARGET_DIR/$COMPONENT_NAME"

# Create index.js for barrel exports
cat > "$TARGET_DIR/$COMPONENT_NAME/index.js" << EOF
export { default } from './${COMPONENT_NAME}';
EOF

# Copy component to new location
cp "$COMPONENT_PATH" "$TARGET_DIR/$COMPONENT_NAME/${COMPONENT_NAME}.jsx"

# Extract types to separate file if TypeScript
if [[ $COMPONENT_PATH == *.tsx ]]; then
  echo "Extracting types to separate file..."
  node scripts/extract-types.js "$COMPONENT_PATH" "$TARGET_DIR/$COMPONENT_NAME/types.ts"
fi

# Extract styles to separate file
echo "Extracting styles to separate file..."
node scripts/extract-styles.js "$COMPONENT_PATH" "$TARGET_DIR/$COMPONENT_NAME/styles.module.css"

echo "Component refactored to $TARGET_DIR/$COMPONENT_NAME/"
```

### Find Duplicate Code

Create a script to identify code duplication:

```bash
#!/bin/bash
# find-duplicates.sh

echo "Finding duplicate code..."

# Install jsinspect if not present
if ! command -v jsinspect &> /dev/null; then
  npm install -g jsinspect
fi

# Find duplicates in JavaScript/TypeScript files
jsinspect --ignore "node_modules|dist|build|coverage" \
  --threshold 30 \
  --identifiers \
  --jsx \
  src/ components/ > ./reports/duplicates.txt

echo "Found $(grep -c "Match #" ./reports/duplicates.txt) duplicate code blocks."
```

## 8. Implementation Plan

### Phase 1: Code Quality Setup (Week 1)

1. Set up ESLint and Prettier configurations
2. Configure CI/CD pipeline with GitHub Actions
3. Create initial testing framework
4. Implement code complexity analysis tools
5. Establish coding standards documentation

### Phase 2: Critical Refactoring (Weeks 2-3)

1. Break down largest components (>300 lines)
2. Extract custom hooks from components with mixed concerns
3. Consolidate duplicate utility functions
4. Create service modules for API interactions
5. Implement proper error handling throughout

### Phase 3: Architecture Improvements (Weeks 4-5)

1. Implement feature-based organization
2. Create clear interfaces between modules
3. Apply design patterns to solve architectural issues
4. Develop proper dependency injection system
5. Document architectural decisions

### Phase 4: Testing and Documentation (Weeks 6-7)

1. Increase test coverage for critical paths
2. Create end-to-end tests for main user flows
3. Document component API using JSDoc
4. Create architectural diagrams
5. Update README and contribution guidelines

### Phase 5: Continuous Improvement (Ongoing)

1. Regular code quality audits
2. Refactoring sessions as part of sprint planning
3. Technical debt tracking and prioritization
4. Knowledge sharing sessions
5. Continuous integration and deployment improvements
