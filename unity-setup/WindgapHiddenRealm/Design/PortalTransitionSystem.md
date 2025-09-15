# Portal Transition System

## Technical Specification Document

## Overview

The Portal Transition System is a core mechanic in Windgap Academy: The Hidden Realm, enabling players to travel between the real world and various realms within the Academy. These transitions are not merely loading screens but meaningful, thematic experiences that reinforce the narrative and provide an opportunity for anticipation and reflection.

## System Architecture

### Core Components

#### 1. PortalManager

Central system responsible for managing all portal-related functionality:

- Coordinates transitions between realms
- Manages portal appearance and effects
- Handles player movement and camera control during transitions
- Synchronizes with level loading system

#### 2. PortalDefinitions

Scriptable object database containing information about each portal:

- Visual appearance and effects
- Source and destination realms
- Narrative significance
- Special requirements or behaviors

#### 3. TransitionEffectsController

Handles the visual, audio, and haptic effects during portal transitions:

- Shader effects for distortion and particle systems
- Dynamic audio mixing during transitions
- Camera effects and post-processing
- Player avatar transformation effects

#### 4. PortalAccessController

Manages requirements for portal activation and usage:

- Player permission levels
- Story progression gates
- Frequency compatibility checks
- Educational achievement requirements

### Data Structure

```csharp
// Portal Definition
[System.Serializable]
public class PortalDefinition
{
    public string id;                    // Unique identifier
    public string displayName;           // User-facing name
    public string description;           // Narrative description

    public string sourceRealmId;         // Origin realm
    public string destinationRealmId;    // Target realm

    public GameObject portalPrefab;      // Visual representation
    public Material portalMaterial;      // Shader for portal surface
    public ParticleSystem portalParticles;   // Ambient effects

    public AnimationClip entryAnimation;     // Player entry animation
    public AnimationClip exitAnimation;      // Player exit animation

    public AudioClip ambientSound;       // Background portal sound
    public AudioClip transitionSound;    // Sound during transition

    public float transitionDuration;     // How long the transition takes
    public bool requiresLoading;         // Whether destination needs loading

    public List<string> requiredAchievements;    // Achievements needed to use
    public int requiredFrequencyLevel;           // Player level requirement

    public Color portalTint;             // Distinctive color scheme
    public PostProcessingProfile transitionProfile; // Visual effects during transition
}

// Runtime Portal Instance
public class PortalInstance : MonoBehaviour
{
    public string portalDefinitionId;    // Reference to definition
    public bool isActive;                // Whether portal can be used
    public Transform entryPoint;         // Where player enters
    public Transform exitPoint;          // Where player appears at destination

    public InteractionPrompt prompt;     // UI element for interaction
    public List<Renderer> portalRenderers;   // Visual elements to control

    public float currentStability;       // Portal health/status (0-1)
    public PortalState currentState;     // Current operational state

    // Portal operational states
    public enum PortalState
    {
        Inactive,       // Not usable
        Stabilizing,    // Warming up
        Ready,          // Can be used
        Transitioning,  // Currently in use
        Cooldown,       // Temporary unavailable
        Unstable        // Malfunctioning
    }
}
```

## Portal Types

### 1. Central Station Portal

- **ID**: `central_station_portal`
- **Description**: The main entrance disguised as a vintage Sydney elevator
- **Visual**: Retrofitted brass elevator with shimmering light between doors
- **Effect**: Swirling particles with increasing speed, time dilation effect
- **Transition**: 5-second sequence of reality dissolving into light
- **Requirements**: None (entry point to the game)

### 2. Central Nexus Hubs

- **ID**: `nexus_hub_portal`
- **Description**: Primary transportation hubs in the Central Nexus
- **Visual**: Crystalline archways with flowing energy patterns
- **Effect**: Pulsing light that syncs with player's frequency
- **Transition**: 3-second sequence of light engulfment and reformation
- **Requirements**: Unlocked corresponding realm

### 3. Transport Pods

- **ID**: `transport_pod`
- **Description**: Individual travel capsules connecting various locations
- **Visual**: Translucent spheres with swirling interior energy
- **Effect**: Bubble-like encapsulation of player with acceleration effect
- **Transition**: 2-second sequence of rapid movement through energy tunnels
- **Requirements**: Specific Emberstone or achievement

### 4. Reflection Gates

- **ID**: `reflection_gate`
- **Description**: Contemplative transitions to personal spaces
- **Visual**: Mirror-like surfaces that ripple when approached
- **Effect**: Reflective duplication that transforms into destination
- **Transition**: 4-second fade through layers of self-reflection
- **Requirements**: Completed relevant self-reflection activity

### 5. Emergency Rifts

- **ID**: `emergency_rift`
- **Description**: Unstable emergency exits that appear during critical events
- **Visual**: Jagged tears in reality with fluctuating edges
- **Effect**: Urgent pulling effect with unstable visual distortion
- **Transition**: 1-second rapid extraction with disorientation effect
- **Requirements**: Only available during specific narrative events

## Transition Sequence

### Standard Portal Transition Flow

1. **Approach Phase**
   - Portal detects player proximity
   - Ambient effects intensify
   - Portal UI prompt appears
   - Accessibility cue triggered (sound, haptic)

2. **Initiation Phase**
   - Player triggers interaction
   - Entry animation begins
   - Camera begins transition effect
   - Source realm audio fades
   - Player controls temporarily restricted

3. **Transition Phase**
   - Full screen transition effect
   - Loading occurs if needed (masked by effect)
   - Narrative text/hints may appear
   - Transition audio plays
   - Haptic feedback patterns occur

4. **Emergence Phase**
   - Transition effect fades
   - Exit animation plays
   - Destination realm audio fades in
   - Camera stabilizes
   - Player controls restored
   - Orientation guide briefly appears

```csharp
// Pseudo-code for portal transition sequence
public IEnumerator PerformPortalTransition(PortalInstance portal, Player player)
{
    // 1. Approach Phase - handled by trigger colliders

    // 2. Initiation Phase
    portal.currentState = PortalState.Transitioning;
    player.SetControlsEnabled(false);

    var definition = GetPortalDefinition(portal.portalDefinitionId);
    player.PlayAnimation(definition.entryAnimation);

    AudioManager.FadeOut(currentRealmAmbience, 1.0f);
    AudioManager.PlayOneShot(definition.transitionSound);

    // Begin camera effects
    TransitionEffectsController.BeginTransition(definition.transitionProfile);

    // 3. Transition Phase
    if (definition.requiresLoading)
    {
        AsyncOperation loadOperation = SceneManager.LoadSceneAsync(
            definition.destinationRealmId, LoadSceneMode.Additive);

        while (!loadOperation.isDone)
        {
            // Update transition effect based on load progress
            float progress = Mathf.Clamp01(loadOperation.progress / 0.9f);
            TransitionEffectsController.UpdateTransition(progress);
            yield return null;
        }
    }
    else
    {
        // Simpler transition for already-loaded destinations
        float elapsed = 0f;
        while (elapsed < definition.transitionDuration)
        {
            float progress = elapsed / definition.transitionDuration;
            TransitionEffectsController.UpdateTransition(progress);
            elapsed += Time.deltaTime;
            yield return null;
        }
    }

    // 4. Emergence Phase
    // Teleport player to destination
    player.transform.position = portal.exitPoint.position;
    player.transform.rotation = portal.exitPoint.rotation;

    player.PlayAnimation(definition.exitAnimation);

    AudioManager.FadeIn(destinationRealmAmbience, 1.0f);

    // End camera effects
    TransitionEffectsController.EndTransition();

    // Display orientation guide
    UIManager.ShowOrientationGuide(definition.destinationRealmId);

    // Restore player control
    yield return new WaitForSeconds(0.5f); // Brief pause
    player.SetControlsEnabled(true);

    portal.currentState = PortalState.Cooldown;

    // Start cooldown timer
    StartCoroutine(PortalCooldown(portal));
}
```

## Visual Effects System

### Portal Surface Shader

- **Render technique**: Custom shader with depth-based effects
- **Animation**: Flowing UV distortion based on realm energy
- **Interactivity**: Responds to player proximity with ripple effects
- **Accessibility**: Configurable intensity and motion reduction options

### Transition Effect Stack

A layered set of effects for different transition phases:

1. **Edge Distortion**
   - Warps the edges of the screen
   - Increases in intensity during transition
   - Represents the bending of reality

2. **Color Shifting**
   - Gradual shift to portal's color scheme
   - Creates visual identity for each realm
   - Provides subconscious destination cue

3. **Particle Flow**
   - Directional particle flow indicating movement
   - Speeds up during transition peak
   - Provides sense of motion and progress

4. **Light Adaptation**
   - Manages exposure for dramatic light changes
   - Prevents jarring visual transitions
   - Simulates eye adjustment to new environments

### Transition Post-Processing

- **Bloom**: Enhances energy effects and light sources
- **Chromatic Aberration**: Creates reality distortion at transition peaks
- **Depth of Field**: Focuses attention during transition
- **Grain**: Adds texture to void-like transition spaces
- **Vignette**: Directs focus toward center during transitions

## Audio Design

### Portal Ambient Audio

- **Base layer**: Low frequency hum unique to each portal type
- **Reactive layer**: Mid-frequency tones that respond to player proximity
- **Spatial design**: 3D positioned with appropriate falloff
- **Accessibility**: Frequency ranges designed to be detectable with hearing impairments

### Transition Soundscape

Multi-layered audio experience during transitions:

1. **Departure Sounds**
   - Source realm sounds fade with reverb tail
   - Portal-specific "departure" sound (whoosh, chime, etc.)
   - Brief moment of player's "frequency" tone

2. **Transition Space**
   - Non-diegetic "between realms" ambience
   - Spatial audio cues indicating movement direction
   - Optional narration or hint system audio

3. **Arrival Sequence**
   - Destination realm audio fades in gradually
   - Portal-specific "arrival" sound
   - Orientation audio cues for navigation assistance

### Accessibility Audio Cues

- Non-visual indicators of portal states and functions
- Distinct sound patterns for different portal types
- Directional audio to assist navigation
- Text-to-speech descriptions of destinations

## Narrative Integration

### Story Moments

Opportunities for narrative development during transitions:

- **Reflection Prompts**: Questions appearing during longer transitions
- **Memory Fragments**: Brief flashbacks to relevant story moments
- **Character Insights**: Voice-over thoughts or observations
- **World-building Details**: Environmental storytelling in transition space

### Educational Framing

Using transitions as teachable moments:

- **Skill Connections**: Linking just-completed activities to real-world skills
- **Achievement Highlights**: Recognizing recent progress
- **Challenge Previews**: Hints about upcoming learning opportunities
- **Metacognitive Prompts**: Questions about learning process and strategies

## Gameplay Mechanics

### Portal Discovery

Players find and activate new portals through:

- Completing specific quests or challenges
- Reaching frequency milestones
- Collaborative discovery with other players
- Environmental puzzle solving

### Portal Stability

Some portals have dynamic stability affected by:

- Player actions and achievements
- Story progression
- Collaborative maintenance activities
- Regular use and "power flow"

### Transport Pod Customization

Players can personalize transport pods with:

- Visual themes from Emberstone collections
- Speed/duration preferences
- Transition effect preferences
- Custom arrival animations

## Technical Implementation Notes

### Performance Optimization

- Use adaptive quality for transition effects based on hardware
- Implement asynchronous loading with LoadSceneAsync
- Utilize object pooling for portal particle effects
- Consider occlusion culling for portal views

### Multiplayer Considerations

- Synchronize portal states across network
- Handle multiple simultaneous transitions
- Provide group transition options
- Manage appearance of players entering/exiting portals

### Accessibility Implementation

- Provide clear text descriptions of destinations
- Include bypass options for those sensitive to effects
- Ensure colorblind-friendly visual cues
- Support alternative input methods for portal activation

## Development Roadmap

### Phase 1: Core Functionality (Weeks 1-3)

- Basic portal manager implementation
- Simple transition between two test areas
- Fundamental visual effect prototype
- Portal definition system

### Phase 2: Visual Development (Weeks 4-6)

- Shader development for portal surfaces
- Transition effect sequence implementation
- Initial portal models and animations
- Basic audio implementation

### Phase 3: Realm Connections (Weeks 7-10)

- All main portal types implemented
- Full realm connection map established
- Loading system optimization
- Narrative integration points

### Phase 4: Polish & Accessibility (Weeks 11-14)

- Advanced visual effects and optimization
- Complete audio design implementation
- Full accessibility feature set
- Playtesting and refinement
