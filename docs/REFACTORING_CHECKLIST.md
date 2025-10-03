# Windgap Academy Refactoring Checklist

This checklist provides a systematic approach to refactoring the Windgap Academy codebase, helping to identify priorities and track progress.

## Step 1: Analysis and Planning

Before starting any refactoring work, complete these preparation steps:

- [ ] Run code complexity analyzer
  ```bash
  npm run refactor:analyze
  ```
- [ ] Generate component dependency visualization
  ```bash
  npm run refactor:visualize
  ```
- [ ] Analyze prop drilling issues
  ```bash
  npm run refactor:props
  ```
- [ ] Review reports and identify top priorities
- [ ] Create GitHub issues for identified refactorings
- [ ] Assign priority labels (High/Medium/Low) to issues
- [ ] Create a refactoring roadmap with estimated timelines

## Step 2: Prioritization Guidelines

Use these guidelines to prioritize refactoring tasks:

### High Priority:

- Components over 500 lines
- Functions over 50 lines
- Prop drilling over 5 levels deep
- Files with more than 20 imports
- Code causing performance issues
- Code with repeated bugs

### Medium Priority:

- Components between 300-500 lines
- Prop drilling 3-5 levels deep
- Duplicate code patterns
- Mixed concerns (UI + business logic)
- Inconsistent component patterns

### Low Priority:

- Components under 300 lines with minor issues
- Stylistic improvements
- Renaming for better clarity
- Non-critical optimization

## Step 3: Refactoring Approach

For each component or module selected for refactoring:

1. **Preparation**
   - [ ] Ensure adequate test coverage exists
   - [ ] Create new tests if coverage is insufficient
   - [ ] Create a feature branch for the refactoring

2. **Implement Refactoring**
   - [ ] Extract smaller components from large ones
     ```bash
     npm run refactor:extract <file> <component-name> <start-line> <end-line>
     ```
   - [ ] Convert prop drilling to context where appropriate
   - [ ] Extract business logic to custom hooks
   - [ ] Separate container and presentation components
   - [ ] Implement appropriate design patterns

3. **Testing**
   - [ ] Generate tests for new components
     ```bash
     npm run refactor:test <file>
     ```
   - [ ] Ensure all tests pass
   - [ ] Verify no regression in functionality

4. **Review & Merge**
   - [ ] Self-review the refactored code
   - [ ] Request peer review
   - [ ] Address review feedback
   - [ ] Merge to develop branch

## Step 4: Common Refactoring Patterns

Apply these common refactoring patterns as appropriate:

### Extract Component

When a component is too large or handles multiple concerns:

```bash
npm run refactor:extract src/components/LargeComponent.jsx NewComponent 120 180
```

### Extract Custom Hook

When logic can be reused across components:

```jsx
// Before
function Component() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  // ...
}

// After
function useDataFetching() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return data;
}

function Component() {
  const data = useDataFetching();
  // ...
}
```

### Container/Presenter Pattern

When mixing data fetching with presentation:

```jsx
// Container
function UserProfileContainer({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);
  return <UserProfilePresenter user={user} />;
}

// Presenter
function UserProfilePresenter({ user }) {
  if (!user) return <Loading />;
  return <div>{user.name}</div>;
}
```

### Context API for Prop Drilling

When props are passed through many components:

```jsx
// Create context
const UserContext = React.createContext();

// Provider
function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}

// Consumer
function DeepComponent() {
  const { user } = useContext(UserContext);
  return <div>{user.name}</div>;
}
```

## Step 5: Tracking Progress

Track refactoring progress using these metrics:

- Number of components under 300 lines
- Average component size
- Maximum prop drilling depth
- Test coverage percentage
- Bundle size

Create a dashboard to visualize these metrics over time and celebrate improvements.

## Step 6: Documentation

For each refactored module:

- [ ] Update component documentation
- [ ] Document design patterns used
- [ ] Document any performance improvements
- [ ] Update architecture diagrams if needed

## Additional Resources

- [CODE_REFACTORING_GUIDE.md](/docs/CODE_REFACTORING_GUIDE.md) - Comprehensive refactoring guide
- [REFACTORING_PATTERNS.md](/docs/REFACTORING_PATTERNS.md) - Examples of common refactoring patterns
- [COMPONENT_DOCUMENTATION_TEMPLATE.md](/docs/COMPONENT_DOCUMENTATION_TEMPLATE.md) - Template for documenting components
