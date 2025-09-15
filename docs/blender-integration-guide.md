# Blender Integration Guide for Windgap Academy

This guide covers how to create, rig, animate, and export 3D characters and environments from Blender for use with the Windgap Academy WebGL utilities.

## Table of Contents

- [Setup](#setup)
- [Character Creation](#character-creation)
- [Rigging](#rigging)
- [Animation](#animation)
- [Exporting](#exporting)
- [Integration with WebGL Utilities](#integration)
- [Performance Optimization](#optimization)

<a name="setup"></a>

## Setup

### Required Blender Version

- Blender 3.6 or higher is recommended
- Install the GLTF 2.0 exporter (included by default in newer Blender versions)

### Project Setup

1. Configure Blender units to match Three.js:
   - Open Blender preferences
   - Go to Scene → Units
   - Set Unit System to "Metric"
   - Set Unit Scale to 1.0

2. Set up a proper scale:
   - Typical character height: 1.8 meters (scales to 1.8 units in Three.js)
   - Environment objects should use consistent scaling

3. Create a project folder structure:
   ```
   /blender-assets/
     /characters/
       /winnie/
       /natalie/
       /daisy/
       /andy/
     /environments/
       /classroom/
       /playground/
     /props/
     /textures/
   ```

<a name="character-creation"></a>

## Character Creation

### Character Modeling Guidelines

- Keep polygon count between 3,000-8,000 triangles for web performance
- Create characters with T-pose as the default pose
- Ensure all geometry is properly manifold (no holes)
- Apply all transformations before export (Ctrl+A → All Transforms)

### Materials Setup

1. Use Principled BSDF shader for PBR materials
2. Keep textures at 1024×1024 or 2048×2048 maximum resolution
3. Create the following texture maps as needed:
   - Base Color
   - Normal
   - Roughness
   - Metallic (if needed)

### UV Mapping

1. Create clean, non-overlapping UV maps
2. Optimize seams to be hidden in less visible areas
3. Pack UVs efficiently to maximize texture space
4. Use UV islands for separate parts (head, body, clothing)

<a name="rigging"></a>

## Rigging for Education Characters

### Bone Structure

Create a hierarchical bone structure that matches the animation requirements:

```
- Root
  - Hips
    - Spine
      - Chest
        - Neck
          - Head
        - Shoulder.L
          - UpperArm.L
            - LowerArm.L
              - Hand.L
                - Fingers...
        - Shoulder.R
          - (mirror of left arm)
    - UpperLeg.L
      - LowerLeg.L
        - Foot.L
    - UpperLeg.R
      - (mirror of left leg)
```

### Weight Painting

1. Assign weights properly to ensure smooth deformation
2. Pay special attention to joint areas (shoulders, elbows, knees)
3. Use automatic weights as a starting point, then refine manually
4. Test the rig with basic poses before animation

### Face Rigging (Optional)

1. Create face shape keys for expressions like:
   - Smile
   - Frown
   - Surprise
   - Talking

<a name="animation"></a>

## Animation

### Required Animations for Educational Characters

Create the following standard animations for all characters:

1. **idle**: Subtle movement, breathing, looking around (looping)
2. **teaching**: Gesturing with hands, pointing, explaining (looping)
3. **encourage**: Nodding, thumbs up, clapping (looping)
4. **celebrate**: Jumping, raising arms, excited movement (looping)
5. **wave**: Friendly greeting wave (non-looping)
6. **walk**: Basic walking cycle (looping)

### Animation Guidelines

1. Set framerate to 30fps for web performance
2. Keep animations between 30-90 frames where possible
3. Use the NLA Editor to organize animations
4. Create clear keyframes at start and end for looping animations
5. Ensure smooth transitions between animations

### Testing Animations

1. Use the Action Editor to preview animations
2. Check for issues like:
   - Clipping/interpenetration
   - Unnatural movement
   - Proper weight distribution
   - Smooth transitions

<a name="exporting"></a>

## Exporting for Three.js

### GLTF/GLB Export Settings

1. Select your rigged and animated character
2. Go to File → Export → glTF 2.0 (.glb/.gltf)
3. Configure export settings:
   - Format: GLB (binary) for single file export
   - Include: Selected Objects
   - Transform:
     - +Y Up (Blender default)
   - Geometry:
     - Apply Modifiers: Checked
     - UVs: Checked
     - Normals: Checked
     - Tangents: Checked
   - Animation:
     - Animation: Checked
     - Animation type: NLA Tracks
     - Limit to Playback Range: Unchecked
     - Always Sample Animations: Checked
     - Skinning: Checked
     - Shape Keys: Checked
     - Morph Normals: Checked

4. Export each character to the appropriate folder:
   ```
   /assets/characters/[character-name]/[character-name].glb
   ```

<a name="integration"></a>

## Integration with WebGL Utilities

### Using CharacterAnimator with Blender Models

```javascript
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import CharacterAnimator from "../utils/CharacterAnimator";

// Load the Blender-created character
const characterPath = "/assets/characters/winnie/winnie.glb";
const characterOptions = {
  position: { x: 0, y: 0, z: 0 },
  scale: 1,
  animations: {
    idle: "idle",
    teaching: "teaching",
    encourage: "encourage",
    celebrate: "celebrate",
    wave: "wave",
    walk: "walk",
  },
};

// Create a new character animator
const animator = new CharacterAnimator();
animator.loadCharacter(characterPath, characterOptions).then((character) => {
  // Character loaded, can now play animations
  animator.playAnimation("wave");

  // Add WebGL effects if desired
  WebGLEffectsUtil.createGlowEffect(character.scene, {
    color: "#6366f1",
    intensity: 0.5,
    pulseSpeed: 2,
    duration: 3,
  });
});
```

### Adding Custom Animations to Existing Characters

If you create new animations in Blender for existing characters:

1. Export only the new animations from Blender
2. Update the animations object in your CharacterAnimator instance:

```javascript
characterAnimator.addAnimation("newAnimation", "NewAnimationName");
```

<a name="optimization"></a>

## Performance Optimization

### Model Optimization

1. Use a decimation modifier to reduce polygon count if needed
2. Apply only necessary modifiers before export
3. Remove unused vertex groups and shape keys

### Texture Optimization

1. Combine textures where possible (e.g., roughness and metallic in R and G channels)
2. Use texture compression (WebP format for web use)
3. Generate mipmaps for better performance at different distances

### Animation Optimization

1. Bake animations to reduce bone count if character is complex
2. Use fewer keyframes for simpler animations
3. Simplify facial animations for web performance

## Troubleshooting Common Issues

### Model Appears Too Large/Small

- Check the Unit Scale in Blender (should be 1.0)
- Verify scale factor in CharacterAnimator options

### Animations Not Playing

- Ensure animation names in the code match exactly with the names in Blender
- Check console for errors in loading GLTF file
- Verify that animations were included in the export

### Textures Missing or Incorrect

- Check material setup in Blender
- Ensure textures are in the correct format and path
- Verify UV mapping is correct

### Performance Issues

- Reduce polygon count
- Optimize textures
- Simplify or remove complex animations
- Use level of detail (LOD) for distant characters
