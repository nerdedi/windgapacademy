# Creating Educational Characters in Blender

## A Step-by-Step Guide for Windgap Academy

This guide will walk you through the process of creating educational characters in Blender that can be exported and used with the Windgap Academy WebGL utilities.

## Table of Contents

1. [Setting Up Blender](#1-setting-up-blender)
2. [Basic Character Modeling](#2-basic-character-modeling)
3. [Character Rigging](#3-character-rigging)
4. [Creating Animations](#4-creating-animations)
5. [Texturing Your Character](#5-texturing-your-character)
6. [Exporting for Three.js](#6-exporting-for-threejs)

## 1. Setting Up Blender

### Installation and Configuration

1. Download and install Blender from [blender.org](https://www.blender.org/) (version 3.6+ recommended)
2. Configure Blender for proper scale:
   - Go to Edit → Preferences → Scene
   - Set Unit System to "Metric"
   - Set Unit Scale to 1.0

### Setting Up Your Workspace

1. Open Blender and select "General" as your workspace
2. Switch to the "Modeling" workspace tab at the top of the screen
3. Create a new file (File → New → General)
4. Delete the default cube (select it and press X → Delete)

### Creating a Project Template

1. Save your file as a project template:
   - File → Save As → `character_template.blend`
   - Save in your project folder: `/workspaces/windgapacademy/blender-assets/templates/`

## 2. Basic Character Modeling

### Creating a Simple Character Base

1. **Add a reference image** (optional but helpful):
   - In the side view (press 3 on numpad), add an empty image:
   - Add → Empty → Image
   - Open the properties panel (N) and load your reference image
   - Scale it appropriately

2. **Create a base mesh**:
   - Add → Mesh → Cylinder
   - In Edit Mode (Tab), add loop cuts (Ctrl+R) and shape into a basic character
   - For a stylized character like Winnie:
     - Make the head larger (proportionally ~1/3 of body height)
     - Widen the chest and narrow the waist
     - Create short limbs for a friendly appearance

### Modeling the Head

1. **Create a separate mesh for the head**:
   - Add → Mesh → UV Sphere
   - Scale it appropriately
   - In Edit Mode, shape it to match your character's head style
   - For Windgap's educational characters, use simplified facial features

2. **Adding facial features**:
   - Eyes: Add → Mesh → UV Sphere, scale down, duplicate for second eye
   - Nose: Extrude faces from the head or add a separate mesh
   - Mouth: Create with edge loops and shape with proportional editing (O key)

### Modeling the Body

1. **Create the torso**:
   - Add → Mesh → Cylinder
   - In Edit Mode, add loop cuts and shape to match your design
   - For educational characters, use simple, friendly shapes

2. **Adding limbs**:
   - Arms: Add → Mesh → Cylinder, position and shape
   - Legs: Add → Mesh → Cylinder, position and shape
   - Hands: Simplified shapes for educational characters
   - Feet: Add → Mesh → Cube, shape as needed

3. **Joining the parts**:
   - Select all body parts (hold Shift while selecting)
   - Ctrl+J to join them into a single mesh
   - In Edit Mode, connect vertices at joints (select vertices, press F)

### T-Pose Setup

1. Position your character in a T-pose:
   - Arms extended horizontally
   - Legs slightly apart
   - Head facing forward
   - This standard pose makes rigging easier

2. Apply all transformations:
   - Select your character mesh
   - Ctrl+A → All Transformations

## 3. Character Rigging

### Setting Up Armature

1. **Create a skeleton**:
   - Add → Armature → Single Bone
   - In Edit Mode, build the skeleton starting from the root:
     - Spine → Chest → Neck → Head
     - Shoulder → Upper Arm → Lower Arm → Hand
     - Hip → Upper Leg → Lower Leg → Foot

2. **Creating a proper hierarchy**:
   - Press E to extrude bones
   - Ensure proper parent-child relationships
   - Name your bones (select bone, press F2):
     - Root, Spine, Chest, Neck, Head
     - Shoulder.L, UpperArm.L, LowerArm.L, Hand.L
     - Shoulder.R, UpperArm.R, LowerArm.R, Hand.R
     - Hip.L, UpperLeg.L, LowerLeg.L, Foot.L
     - Hip.R, UpperLeg.R, LowerLeg.R, Foot.R

3. **Using symmetry** for efficiency:
   - Create bones for one side (e.g., left arm)
   - Select the bones
   - Shift+D to duplicate, then S → X → -1 to mirror
   - Rename with .R suffix (Blender understands this convention)

### Weight Painting

1. **Parenting mesh to armature**:
   - Select the character mesh first
   - Hold Shift and select the armature
   - Ctrl+P → With Automatic Weights

2. **Fixing weight issues**:
   - Enter Weight Paint mode (select mesh, change mode dropdown)
   - Select a bone to see its influence
   - Use the Weight Paint brush to adjust:
     - Blue: No influence
     - Red: Full influence
   - Focus on joints to ensure smooth deformation

3. **Testing the rig**:
   - Switch to Pose Mode
   - Move bones to check for issues
   - Look for vertices that don't move correctly or "skin pinching"
   - Return to Weight Paint mode to fix problems

## 4. Creating Animations

### Setting Up Animation Workspace

1. Switch to the Animation workspace at the top of Blender
2. Make sure your armature is in Pose Mode

### Creating Key Animations

For educational characters, create these essential animations:

1. **Idle Animation** (looping, 30-60 frames):
   - Subtle body movement and breathing
   - Slight head movement
   - Position the bones for frame 1
   - Select all bones (A), press I → LocRotScale
   - Move to frame 30
   - Make slight changes to pose
   - I → LocRotScale again
   - For frame 60, duplicate frame 1 pose for perfect loop

2. **Teaching Animation** (looping, 40-80 frames):
   - Hand gestures (pointing, explaining)
   - Attentive head position
   - Same process: key poses at different frames

3. **Encourage Animation** (looping, 30-60 frames):
   - Nodding
   - Thumbs up or clapping
   - Friendly facial expression

4. **Celebrate Animation** (looping, 30-60 frames):
   - Arms raised
   - Excited movement
   - Jumping or dancing motion

5. **Wave Animation** (non-looping, 20-30 frames):
   - Arm raised
   - Hand waving motion
   - Return to rest pose

### Organizing Animations with Actions

1. In the Action Editor (bottom of screen), create a new action for each animation
2. Name them clearly: "Idle", "Teaching", "Encourage", "Celebrate", "Wave"
3. Use the "Push Down" button to save each action after creating it

### Testing Animations

1. Play animations with the Play button in the timeline
2. Check for issues like:
   - Interpenetration (parts going through each other)
   - Unnatural movements
   - Bad deformations at joints

## 5. Texturing Your Character

### UV Unwrapping

1. Select your character mesh
2. Enter Edit Mode (Tab)
3. Select all vertices (A)
4. Press U → Unwrap
5. Switch to the UV Editing workspace to view the UV map

### Creating Simple Materials

1. In the Material Properties panel:
   - Add a new material
   - Use Principled BSDF shader
   - Set Base Color to your desired color

2. For a more advanced character:
   - Create an image texture in Photoshop/GIMP (1024×1024 or 2048×2048)
   - In Blender, add an Image Texture node connected to Base Color
   - Load your texture

3. For educational characters, keep materials simple:
   - Use flat colors or simple gradients
   - Focus on readable features
   - Ensure good contrast for visibility

## 6. Exporting for Three.js

### Preparing for Export

1. Make sure your character is in T-pose
2. Apply all modifiers (if any)
3. Ensure animations are saved as actions

### Exporting to GLB Format

1. File → Export → glTF 2.0 (.glb/.gltf)
2. Configure export settings:
   - Format: GLB (single file)
   - Include: Selected Objects
   - Transform: +Y Up
   - Animation:
     - Check "Animation" box
     - Animation Type: "Actions"
     - Always Sample Animation: Checked
     - Group by NLA Track: Checked
   - Geometry:
     - Apply Modifiers: Checked
     - UVs: Checked
     - Normals: Checked
     - Tangents: Checked
   - Compression: Not needed for educational characters

3. Save to your project's character folder:
   `/workspaces/windgapacademy/assets/characters/[character-name]/[character-name].glb`

### Using the Asset Pipeline

1. Once your character is exported, use the provided script to process it:

   ```bash
   cd /workspaces/windgapacademy
   ./scripts/blender-to-threejs.sh
   ```

2. This will automatically place your character in the correct directory structure for the WebGL utilities.

## Next Steps

Now that you've created your character, you can:

1. Use the `BlenderModelViewer` component to display it
2. Add it to your `CurriculumBuilder` or other educational components
3. Apply WebGL effects using the WebGLEffectsUtil

For more details, see the full [Blender Integration Guide](/docs/blender-integration-guide.md).

## Tutorial Videos

For visual learners, these Blender tutorials are helpful:

1. [Beginner Character Modeling](https://www.youtube.com/watch?v=9xAumJRKV6A)
2. [Character Rigging for Beginners](https://www.youtube.com/watch?v=srpOeu9UUBU)
3. [Animation Basics in Blender](https://www.youtube.com/watch?v=zp6kCe5Kmf4)
