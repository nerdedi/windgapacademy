---
# Portal System Tests Documentation

This document provides an overview of the integration tests created for the Portal and Character systems in the WindgapHiddenRealm project.

## Test Structure

The tests are organized into multiple categories:

1. **Edit Mode Tests** - Located in `Assets/Tests/EditMode/Portals`
   - Basic unit tests for Portal component functionality
   - Does not require the Unity player to run

2. **Play Mode Tests** - Located in `Assets/Tests/PlayMode/Portals`
   - Tests that require the Unity runtime environment
   - Validates visual and audio components that are created at runtime

3. **Integration Tests** - Located in `Assets/Tests/Integration`
   - Tests interaction between Portal system and Character system
   - Validates that portals correctly affect character state and movement

4. **Accessibility Tests** - Located in `Assets/Tests/Accessibility`
   - Focused on validating accessibility features
   - Tests high contrast mode, large interaction zones, audio cues, and visual pulse features

## Running the Tests

### Using Unity Test Runner

1. Open the Unity Test Runner window:
   - From the Unity menu, select `Window > General > Test Runner`

2. Run Edit Mode tests:
   - In the Test Runner window, select the `EditMode` tab
   - Click on `Run All` or select specific tests to run

3. Run Play Mode tests:
   - In the Test Runner window, select the `PlayMode` tab
   - Click on `Run All` or select specific tests to run

### From Command Line

For CI/CD pipelines, you can run tests using Unity's command line arguments:

```bash
Unity -batchmode -projectPath "path/to/project" -runTests -testPlatform EditMode -testResults "path/to/results.xml"
```

Or for Play Mode tests:

```bash
Unity -batchmode -projectPath "path/to/project" -runTests -testPlatform PlayMode -testResults "path/to/results.xml"
```

## Test Coverage

The test suite covers:

- Basic Portal initialization and properties
- Portal visual components (lights, particles, renderer)
- Portal audio components
- Player teleportation mechanics
- Accessibility features:
  - High contrast mode
  - Large interaction zones
  - Audio cues
  - Visual pulse feedback
- Integration with character movement and state

## Adding New Tests

When adding new portal or character features, follow these guidelines:

1. Add corresponding unit tests in the Edit Mode test folder
2. For visual or audio components, add Play Mode tests
3. For interactions between systems, add Integration tests
4. For accessibility features, add specific Accessibility tests

## Troubleshooting Common Test Issues

- **Player not found in tests**: Ensure your test creates a GameObject with the "Player" tag
- **Portal visual components not initialized**: Allow one frame to pass using `yield return null` after creating the Portal
- **Audio not testable**: Since Unity cannot play audio in tests, verify the AudioSource configuration instead
---
