# Blender Character Workflow for Windgap Academy

This document provides a detailed guide for creating and integrating 3D characters made with Blender into the Windgap Academy platform.

## Table of Contents

1. [Setup Requirements](#setup-requirements)
2. [Character Design Guidelines](#character-design-guidelines)
3. [Modeling Process](#modeling-process)
4. [Rigging Guidelines](#rigging-guidelines)
5. [Animation Standards](#animation-standards)
6. [Texturing & Materials](#texturing--materials)
7. [Exporting for Web](#exporting-for-web)
8. [Integration with Windgap](#integration-with-windgap)
9. [Troubleshooting](#troubleshooting)
10. [Resources](#resources)

## Setup Requirements

### Software

- **Blender 3.0+** (3.3+ recommended)
- **Image editing software** (Photoshop, GIMP, or Krita)
- **Text editor** for JSON configuration

### Add-ons

- **Better Export** - For optimized GLB/GLTF files
- **Rigify** - For character rigging
- **Node Wrangler** - For material creation

### Environment Setup

1. Download the Windgap Character Template file from `assets/templates/windgap_character_template.blend`
2. Set up proper project structure:
   ```
   character_project/
   ├── blender/            # Source files
   │   └── character.blend
   ├── textures/           # All texture maps
   │   ├── diffuse.png
   │   ├── normal.png
   │   └── ...
   ├── export/             # Export files
   │   └── character.glb
   └── config.json         # Character configuration
   ```

## Character Design Guidelines

### Style Requirements

- **Stylized but not cartoonish** - Semi-realistic proportions with stylized features
- **Approachable appearance** - Friendly facial features
- **Accessibility conscious** - High contrast features, clear silhouettes
- **Culturally diverse** - Represent varied backgrounds and appearances

### Polygon Budget

- **Character body**: 15,000-25,000 triangles
- **Head/face**: 5,000-8,000 triangles
- **Hands**: 2,000-3,000 triangles
- **Clothing**: 5,000-10,000 triangles

### Dimensions

- **Height**: Adult characters should be 1.8 Blender units tall
- **T-Pose**: Characters should be modeled in T-pose
- **Origin**: Set at the center between the feet
- **Forward direction**: Negative Y-axis in Blender (standard)

## Modeling Process

### Basic Workflow

1. **Base Mesh Creation**:
   - Start with a basic human mesh (use the template provided)
   - Model in symmetry mode when possible
   - Use subdivision surface modifier for smoother shapes

2. **Topology Guidelines**:
   - Use quad topology (avoid triangles and n-gons)
   - Higher density in deformation areas (face, joints, hands)
   - Follow natural muscle flow for edge loops
   - Ensure proper edge loops around eyes, mouth for animations

3. **Facial Features**:
   - Create detailed facial topology for expressions
   - Separate eye geometry
   - Detailed mouth interior for speaking animations
   - Well-defined eyebrow region

4. **Clothing**:
   - Model as separate objects from the body
   - Avoid interpenetration with body
   - Add appropriate thickness to fabric
   - Use cloth simulation for initial draping if needed

### Optimization Tips

- Use **mirror modifier** during modeling
- Apply all modifiers before rigging
- Check for **non-manifold geometry** and fix before rigging
- Use **shape keys** for facial expressions
- **Decimate modifier** can be used carefully for optimization

## Rigging Guidelines

### Skeleton Structure

- Use the **Rigify Human (Meta-Rig)** as starting point
- Standard humanoid skeleton with:
  - Spine with 3-4 vertebrae
  - Full finger articulation
  - Facial bones for expressions
  - Extra controls for clothing/accessories

### Bone Naming Convention

Follow this naming convention for compatibility:

- `DEF-` prefix for deformation bones
- `MCH-` prefix for mechanism bones
- `ORG-` prefix for original bones
- `.L` and `.R` suffixes for left/right

### Weight Painting

- Clean weight distribution with minimal overlap
- Ensure smooth deformation at joints
- Special attention to facial weights
- Test with extreme poses before finalizing

### Control Rig

The character should have these primary controls:

- Main/root control
- Torso/COG control
- IK controls for hands and feet
- FK controls for arms and legs
- Facial controls for expressions
- Switchable IK/FK system

## Animation Standards

### Required Animations

Each character must include these basic animations:

1. **idle** - Subtle breathing and weight shifting
2. **walk** - Natural walking cycle
3. **talk** - Speaking animation with appropriate facial movements
4. **point** - Gesture to direct attention
5. **celebrate** - Positive, encouraging animation
6. **thinking** - Contemplative pose
7. **teaching** - Explanatory gesture sequence

### Animation Guidelines

- **Frame Rate**: 24 FPS
- **Loop Points**: Ensure seamless loops for cyclic animations
- **Duration**:
  - Idle: 2-3 seconds
  - Walk: 1-2 seconds per cycle
  - Action animations: 1-3 seconds
- **Keyframing**:
  - Use ease in/out for smooth motion
  - Apply principles of anticipation and follow-through
  - Keep movements natural and weight-appropriate

### Animation Data Structure

Animations should be organized as:

```
"animations": [
  {
    "id": "idle",
    "name": "Idle",
    "clipName": "Character_Idle"
  },
  {
    "id": "walk",
    "name": "Walking",
    "clipName": "Character_Walk"
  }
]
```

## Texturing & Materials

### Texture Maps

Create the following texture maps:

- **Base Color** (Diffuse) - 2048×2048px
- **Normal Map** - 2048×2048px
- **Roughness Map** - 1024×1024px
- **Ambient Occlusion** - 1024×1024px

### Material Setup

- Use **Principled BSDF** shader for all materials
- Organize materials with clear naming:
  - `Character_Skin`
  - `Character_Clothing_Main`
  - `Character_Hair`
  - `Character_Eyes`
- Set appropriate values:
  - Skin Subsurface: 0.1-0.2
  - Clothing Roughness: 0.7-0.9
  - Eyes Specular: 0.5-0.7

### UV Layout

- Create clean, non-overlapping UVs
- Maximize texture space usage
- Group similar materials in UV islands
- Allow 2-4px padding between islands
- Maintain uniform texel density across the model

## Exporting for Web

### Export Settings

1. File Format: **glTF Binary (.glb)**
2. Include:
   - Selected Objects
   - Custom Properties
   - Animations
3. Transform:
   - +Y Up (for web standard orientation)
4. Geometry:
   - Apply Modifiers
   - UVs
   - Normals
   - Tangents
5. Animation:
   - Include all animations
   - Sampling Rate: 24fps
   - Always Sample Animations

### Optimization Tips

- **Compress textures** to WebP when possible
- **Simplify materials** by baking when needed
- **Verify file size** - target under 5MB for characters
- **Test in browser** before final submission

### Configuration JSON

Create a `character_config.json` file with:

```json
{
  "id": "character_name",
  "name": "Display Name",
  "modelPath": "/assets/characters/character_name/character.glb",
  "thumbnailPath": "/assets/characters/character_name/thumbnail.jpg",
  "description": "A brief description of the character",
  "animations": [
    {
      "id": "idle",
      "label": "Idle",
      "clipName": "Character_Idle"
    },
    {
      "id": "walk",
      "label": "Walking",
      "clipName": "Character_Walk"
    }
  ]
}
```

## Integration with Windgap

### File Structure

Place your character in:

```
/assets/characters/[character_name]/
├── [character_name].glb
├── thumbnail.jpg
└── character_config.json
```

### Component Integration

Import your character in React components:

```jsx
import BlenderModelViewer from "../components/BlenderModelViewer";

// Inside your component
<BlenderModelViewer
  modelPath={`/assets/characters/${characterName}/${characterName}.glb`}
  isCharacter={true}
  initialAnimation="idle"
  availableAnimations={characterConfig.animations}
  showControls={true}
/>;
```

### Animation Controls

To trigger animations from code:

```jsx
const [currentAnimation, setCurrentAnimation] = useState("idle");

// Later in code to trigger animation
setCurrentAnimation("celebrate");
```

## Troubleshooting

### Common Issues and Solutions

#### Model Appears Too Small/Large

- Check scale during export (use 1.0 scale)
- Verify unit settings in Blender (meters recommended)

#### Animations Not Playing

- Ensure clip names match between export and configuration
- Check animation actions are included in export
- Verify bone names are consistent

#### Texture Issues

- Confirm textures are packed in GLB or paths are correct
- Check for broken UV maps
- Verify PBR material setup is correct

#### Performance Problems

- Reduce polygon count
- Optimize texture sizes
- Simplify rig if possible
- Check for redundant vertices or faces

## Resources

### Tutorials

- [Blender Character Creation](https://docs.blender.org/manual/en/latest/sculpt_paint/sculpting/introduction.html)
- [Rigify Tutorial](https://docs.blender.org/manual/en/latest/addons/rigging/rigify/index.html)
- [Three.js Animation System](https://threejs.org/docs/#manual/en/introduction/Animation-system)

### Windgap-Specific Resources

- Character Template: `/assets/templates/windgap_character_template.blend`
- Animation Reference: `/docs/animation_reference.mp4`
- Style Guide: `/docs/windgap_character_style_guide.pdf`

### Tools

- [glTF Validator](https://github.khronos.org/glTF-Validator/)
- [Blender glTF Exporter Documentation](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [Three.js Editor](https://threejs.org/editor/) for testing models
