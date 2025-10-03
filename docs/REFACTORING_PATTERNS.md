# Common Refactoring Patterns for Windgap Academy

This document outlines common refactoring patterns that can be applied to the Windgap Academy codebase, with practical examples and step-by-step instructions.

## 1. Extract Component

### When to use:

- A component is too large (>300 lines)
- A component has multiple responsibilities
- A section of JSX could be reused elsewhere

### Example:

**Before:**

```jsx
// Dashboard.jsx
const Dashboard = () => {
  const [filters, setFilters] = useState({});

  // ... other state and logic

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      {/* This filter panel could be extracted */}
      <div className="filter-panel">
        <h3>Filters</h3>
        <div className="filter-controls">
          <select
            value={filters.course}
            onChange={(e) => setFilters({ ...filters, course: e.target.value })}
          >
            <option value="">All Courses</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
          </select>
          <select
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <button onClick={() => setFilters({})}>Clear</button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="dashboard-content">{/* ... */}</div>
    </div>
  );
};
```

**After:**

```jsx
// FilterPanel.jsx
const FilterPanel = ({ filters, setFilters }) => {
  return (
    <div className="filter-panel">
      <h3>Filters</h3>
      <div className="filter-controls">
        <select
          value={filters.course}
          onChange={(e) => setFilters({ ...filters, course: e.target.value })}
        >
          <option value="">All Courses</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
        </select>
        <select
          value={filters.level}
          onChange={(e) => setFilters({ ...filters, level: e.target.value })}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button onClick={() => setFilters({})}>Clear</button>
      </div>
    </div>
  );
};

export default FilterPanel;
```

```jsx
// Dashboard.jsx
import FilterPanel from "./FilterPanel";

const Dashboard = () => {
  const [filters, setFilters] = useState({});

  // ... other state and logic

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <FilterPanel filters={filters} setFilters={setFilters} />

      {/* Dashboard content */}
      <div className="dashboard-content">{/* ... */}</div>
    </div>
  );
};
```

### Steps:

1. Identify the section to extract
2. Use the component-extractor.js script:
   ```bash
   node scripts/component-extractor.js src/components/Dashboard.jsx FilterPanel 12 28
   ```
3. Review the generated component and the updated source file
4. Adjust props and state as needed
5. Generate tests for the new component:
   ```bash
   node scripts/test-generator.js src/components/FilterPanel.jsx
   ```

## 2. Extract Custom Hook

### When to use:

- Multiple components share the same logic
- A component has complex state management
- The logic can be separated from the UI

### Example:

**Before:**

```jsx
// CourseList.jsx
const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const snapshot = await firebase.firestore().collection("courses").get();
        const courseData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseData);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Render component...
};
```

**After:**

```jsx
// useFetchCollection.js
import { useState, useEffect } from "react";
import firebase from "../firebase";

const useFetchCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const snapshot = await firebase.firestore().collection(collectionName).get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${collectionName}:`, err);
        setError(`Failed to fetch ${collectionName}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName]);

  return { data, loading, error };
};

export default useFetchCollection;
```

```jsx
// CourseList.jsx
import useFetchCollection from "../hooks/useFetchCollection";

const CourseList = () => {
  const { data: courses, loading, error } = useFetchCollection("courses");

  // Render component...
};
```

### Steps:

1. Identify repeated logic across components
2. Create a new file in the `hooks` directory
3. Extract the common logic into a custom hook
4. Update the components to use the new hook
5. Test the hook separately from the components

## 3. Extract Utility Functions

### When to use:

- Logic is not related to component state or lifecycle
- Functions are pure (same input always gives same output)
- Logic could be reused across multiple components

### Example:

**Before:**

```jsx
// GradeCalculator.jsx
const GradeCalculator = ({ assignments }) => {
  const calculateFinalGrade = () => {
    const totalPoints = assignments.reduce((sum, assignment) => sum + assignment.points, 0);
    const earnedPoints = assignments.reduce((sum, assignment) => sum + assignment.earned, 0);
    const percentage = (earnedPoints / totalPoints) * 100;

    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // Render component...
};
```

**After:**

```jsx
// gradeUtils.js
export const calculatePercentage = (earned, total) => {
  if (total === 0) return 0;
  return (earned / total) * 100;
};

export const getLetterGrade = (percentage) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

export const calculateFinalGrade = (assignments) => {
  const totalPoints = assignments.reduce((sum, assignment) => sum + assignment.points, 0);
  const earnedPoints = assignments.reduce((sum, assignment) => sum + assignment.earned, 0);
  const percentage = calculatePercentage(earnedPoints, totalPoints);
  return getLetterGrade(percentage);
};
```

```jsx
// GradeCalculator.jsx
import { calculateFinalGrade, calculatePercentage } from "../utils/gradeUtils";

const GradeCalculator = ({ assignments }) => {
  const grade = calculateFinalGrade(assignments);
  const percentage = calculatePercentage(
    assignments.reduce((sum, assignment) => sum + assignment.earned, 0),
    assignments.reduce((sum, assignment) => sum + assignment.points, 0),
  );

  // Render component...
};
```

### Steps:

1. Identify pure functions that don't depend on component state
2. Create a new file in the `utils` directory
3. Extract the functions and export them
4. Update the components to import and use the utilities
5. Write unit tests for the utility functions

## 4. Implement Container/Presenter Pattern

### When to use:

- Component mixes data fetching with presentation
- The same UI could be reused with different data sources
- Testing the UI separately would be beneficial

### Example:

**Before:**

```jsx
// StudentProfile.jsx
const StudentProfile = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const doc = await firebase.firestore().collection("students").doc(studentId).get();
        setStudent({
          id: doc.id,
          ...doc.data(),
        });
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="student-profile">
      <h2>{student.name}</h2>
      <div className="profile-details">
        <p>Email: {student.email}</p>
        <p>Grade Level: {student.gradeLevel}</p>
        <p>Enrolled Courses: {student.courses?.length || 0}</p>
      </div>
    </div>
  );
};
```

**After:**

```jsx
// StudentProfileContainer.jsx
import StudentProfilePresenter from "./StudentProfilePresenter";
import { useState, useEffect } from "react";
import firebase from "../firebase";

const StudentProfileContainer = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const doc = await firebase.firestore().collection("students").doc(studentId).get();
        if (doc.exists) {
          setStudent({
            id: doc.id,
            ...doc.data(),
          });
          setError(null);
        } else {
          setStudent(null);
          setError("Student not found");
        }
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  return <StudentProfilePresenter student={student} loading={loading} error={error} />;
};

export default StudentProfileContainer;
```

```jsx
// StudentProfilePresenter.jsx
const StudentProfilePresenter = ({ student, loading, error }) => {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>Student not found</div>;

  return (
    <div className="student-profile">
      <h2>{student.name}</h2>
      <div className="profile-details">
        <p>Email: {student.email}</p>
        <p>Grade Level: {student.gradeLevel}</p>
        <p>Enrolled Courses: {student.courses?.length || 0}</p>
      </div>
    </div>
  );
};

export default StudentProfilePresenter;
```

### Steps:

1. Create a presenter component that handles only the UI rendering
2. Create a container component that handles data fetching and state
3. Pass the data from the container to the presenter as props
4. Export the container as the default component for normal use
5. Export the presenter for testing and stories

## 5. Convert Class Components to Function Components

### When to use:

- Modernizing legacy code
- Need to use React hooks
- Simplifying lifecycle methods

### Example:

**Before:**

```jsx
// CourseCard.jsx
class CourseCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded() {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  }

  render() {
    const { course } = this.props;
    const { expanded } = this.state;

    return (
      <div className="course-card">
        <h3>{course.title}</h3>
        <p>{course.description.substring(0, 100)}...</p>

        {expanded && (
          <div className="course-details">
            <p>{course.description}</p>
            <p>Duration: {course.duration}</p>
            <p>Level: {course.level}</p>
          </div>
        )}

        <button onClick={this.toggleExpanded}>{expanded ? "Show Less" : "Show More"}</button>
      </div>
    );
  }
}
```

**After:**

```jsx
// CourseCard.jsx
import { useState } from "react";

const CourseCard = ({ course }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description.substring(0, 100)}...</p>

      {expanded && (
        <div className="course-details">
          <p>{course.description}</p>
          <p>Duration: {course.duration}</p>
          <p>Level: {course.level}</p>
        </div>
      )}

      <button onClick={toggleExpanded}>{expanded ? "Show Less" : "Show More"}</button>
    </div>
  );
};

export default CourseCard;
```

### Steps:

1. Create state variables for each piece of state with `useState`
2. Replace lifecycle methods with `useEffect`
3. Convert class methods to function declarations or expressions
4. Remove `this` from all references
5. Add dependency arrays to `useEffect` calls

## 6. Implement Render Props Pattern

### When to use:

- Component logic needs to be reused with different renders
- Component needs to share state with parent
- Need to invert control over rendering

### Example:

**Before:**

```jsx
// AnimatedList.jsx
const AnimatedList = ({ items }) => {
  return (
    <div className="animated-list">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="list-item"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
};
```

**After:**

```jsx
// AnimatedContainer.jsx
const AnimatedContainer = ({ items, renderItem }) => {
  return (
    <div className="animated-list">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="list-item"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

// Usage
const CourseList = ({ courses }) => {
  return (
    <AnimatedContainer
      items={courses}
      renderItem={(course) => (
        <>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button>Enroll</button>
        </>
      )}
    />
  );
};

const ResourceList = ({ resources }) => {
  return (
    <AnimatedContainer
      items={resources}
      renderItem={(resource) => (
        <>
          <h3>{resource.name}</h3>
          <p>{resource.type}</p>
          <a href={resource.url}>Download</a>
        </>
      )}
    />
  );
};
```

### Steps:

1. Identify components with similar structure but different item rendering
2. Create a container component that accepts a `renderItem` prop
3. Use the render prop function to render each item
4. Update usage of the component to provide the rendering function

## Summary

These refactoring patterns should be applied systematically across the codebase, starting with the most problematic areas identified by the code complexity analyzer. Always remember to:

1. Write tests before refactoring
2. Make small, incremental changes
3. Commit frequently
4. Document the changes
5. Verify functionality after each step

For more detailed guidance, refer to the [CODE_REFACTORING_GUIDE.md](/docs/CODE_REFACTORING_GUIDE.md).
