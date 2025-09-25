# Setting Up a Unity Test Project for Windgap Academy

This guide walks through creating a minimal test project to verify the integration of Windgap Academy educational scripts with Unity's 3D Game Kit.

## Step 1: Create a New Unity Project

1. Open Unity Hub
2. Click "New Project"
3. Select the "3D" template
4. Name your project "WindgapAcademyTest"
5. Choose a location and click "Create"

## Step 2: Import Required Packages

### Import TextMeshPro

1. Go to Window > Package Manager
2. Click the "+" button
3. Select "Add package by name..."
4. Enter "com.unity.textmeshpro"
5. Click "Add"

### Import Cinemachine

1. Go to Window > Package Manager
2. Click the "+" button
3. Select "Add package by name..."
4. Enter "com.unity.cinemachine"
5. Click "Add"

### Import ProBuilder

1. Go to Window > Package Manager
2. Click the "+" button
3. Select "Add package by name..."
4. Enter "com.unity.probuilder"
5. Click "Add"

## Step 3: Create a Test Scene

1. Create a new scene: File > New Scene
2. Save it as "WindgapTest"
3. Create a basic environment:
   - Create a plane for the ground (GameObject > 3D Object > Plane)
   - Scale it to (5, 1, 5)
   - Add a directional light for illumination

## Step 4: Import Windgap Academy Scripts

1. Create a new folder in your project: "Assets/WindgapAcademy"
2. Copy the following scripts from `/workspaces/windgapacademy/unity-scripts/` to "Assets/WindgapAcademy/":
   - `WindgapAcademyManager.cs`
   - `StudentCharacterController.cs`
   - `LearningStation.cs`
   - `WindgapAcademyUI.cs`
   - `EducationalInterfaces.cs`
   - `ExampleLearningStation.cs`
   - `ExampleEducationalUI.cs`

## Step 5: Create Basic Character

1. Create a capsule to represent the student: GameObject > 3D Object > Capsule
2. Position it at (0, 1, 0)
3. Add the following components:
   - Character Controller (Component > Physics > Character Controller)
   - Student Character Controller (Component > WindgapAcademy > StudentCharacterController)

## Step 6: Set Up Learning Stations

1. Create an empty GameObject named "LearningStation1"
2. Position it at (3, 0, 3)
3. Add the Example Learning Station component:
   - Component > WindgapAcademy > ExampleLearningStation
4. Configure the station:
   - Set Station ID: "station-001"
   - Set Station Name: "Introduction Station"
   - Set Station Description: "This is a test station"
   - Set other parameters as desired

5. Repeat to create a second station at (-3, 0, 3)

## Step 7: Create Academy Manager

1. Create an empty GameObject named "WindgapAcademyManager"
2. Add the WindgapAcademyManager component:
   - Component > WindgapAcademy > WindgapAcademyManager
3. Configure the manager:
   - Drag the student character to the Student Character reference
   - Add the learning stations to the Learning Stations list

## Step 8: Set Up UI

1. Create a new Canvas: GameObject > UI > Canvas
2. Add the Example Educational UI component:
   - Component > WindgapAcademy > ExampleEducationalUI
3. Create UI elements as referenced in the ExampleEducationalUI script:
   - Create a Lesson Panel with Text elements
   - Create a Quiz Panel with Buttons
   - Add a Progress Bar

## Step 9: Test Basic Functionality

1. Enter Play mode
2. Verify character movement (WASD + Space)
3. Approach a learning station
4. Test interaction (E key)
5. Verify content appears in UI
6. Complete the interaction

## Step 10: Test WebGL Communication

1. Create a new JavaScript plugin file at "Assets/Plugins/WebGLPlugins.jslib":

```javascript
mergeInto(LibraryManager.library, {
  SendToReact: function (eventName, data) {
    console.log("Unity sending to React:", UTF8ToString(eventName), UTF8ToString(data));
    // In a real integration, this would call to the React app
  },
});
```

2. Open Build Settings: File > Build Settings
3. Switch platform to WebGL
4. Click "Build" and choose a destination folder
5. Open the build in a web browser
6. Check browser console for communication messages

## Next Steps

Once this test project is working correctly, you can proceed with:

1. Importing the full 3D Game Kit
2. Adapting the kit's environment and characters
3. Replacing the placeholder character with the kit's character
4. Adding more complex educational content
5. Setting up a proper WebGL build for integration with Windgap Academy's React frontend

## Troubleshooting

### Script Compilation Errors

- Check for namespace conflicts
- Ensure TextMeshPro is properly imported if using TMP components
- Verify script references are properly connected in the Inspector

### Character Controller Issues

- Check collision settings
- Verify input settings in the Input Manager
- Check for conflicting components on the character

### WebGL Communication Problems

- Enable "Development Build" for more verbose logging
- Check for JavaScript errors in the browser console
- Verify the jslib plugin is in the correct location

### Performance Issues

- Use the Unity Profiler to identify bottlenecks
- Reduce graphical quality settings for WebGL
- Minimize use of real-time lights and shadows
