# Character System Design

## Technical Specification Document

## Overview

The Character System in Windgap Academy: The Hidden Realm is designed with accessibility and diversity as core principles. Players can create avatars that authentically represent themselves, while NPCs showcase a wide range of abilities, neurotypes, and backgrounds. The animation system in particular is built to provide inclusive representation of various movement styles and assistive technologies.

## System Architecture

### Core Components

#### 1. CharacterManager

Central system responsible for managing all character-related functionality:

- Handles character creation and customization
- Manages avatar appearance and animations
- Coordinates NPC behaviors and interactions
- Provides API for gameplay systems to interact with characters

#### 2. AccessibilityAnimationSystem

Specialized animation system supporting diverse movement styles:

- Multiple animation sets for different mobility types
- Seamless transitions between movement modes
- Procedural animation adjustments for assistive devices
- Runtime blending for customized movement patterns

#### 3. CharacterCustomizationController

Manages the visual appearance and identity options:

- Body type and proportions
- Skin tones and features
- Clothing and personal items
- Assistive devices and technologies
- Cultural and personal expression elements

#### 4. FrequencyVisualizationSystem

Renders the unique "frequency" of each character:

- Visual aura representing learning style and strengths
- Dynamic particle effects reflecting emotional state
- Interactive elements that respond to other characters
- Growth patterns showing character development

### Data Structure

```csharp
// Character Definition
[System.Serializable]
public class CharacterDefinition
{
    public string id;                    // Unique identifier
    public string displayName;           // Character name

    public CharacterType type;           // Player, NPC, Guardian, etc.
    public MovementStyle primaryMovementStyle;  // Default movement
    public List<MovementStyle> availableMovementStyles;  // All possible movements

    public GameObject characterPrefab;   // Base model
    public RuntimeAnimatorController animatorController;  // Animation controller

    public FrequencyProfile frequencyProfile;  // Energy/aura settings
    public PersonalityProfile personalityProfile;  // Behavior settings

    public Dictionary<string, GameObject> assistiveDevices;  // Mobility/sensory aids
    public List<CustomizationOption> availableCustomizations;  // Appearance options

    // Character classification
    public enum CharacterType
    {
        Player,
        Guardian,
        Mentor,
        Student,
        AcademyEntity
    }

    // Movement styles
    public enum MovementStyle
    {
        Walking,
        Wheelchair,
        MobilityAid,
        FreeFloating,
        CustomMovement
    }
}

// Runtime Character Instance
public class CharacterInstance : MonoBehaviour
{
    public string characterDefinitionId;  // Reference to definition

    public Animator animator;            // Animation controller
    public FrequencyVisualizer frequency;  // Aura/energy system

    public MovementController movement;  // Current movement behavior
    public InteractionController interaction;  // Interaction behaviors

    public CharacterState currentState;  // Current operational state
    public EmotionalState currentEmotion;  // Current emotional state

    // Current customization selections
    public Dictionary<string, CustomizationChoice> activeCustomizations;

    // Character operational states
    public enum CharacterState
    {
        Idle,
        Moving,
        Interacting,
        InTransition,
        Special
    }

    // Emotional states affecting animations and frequency
    public enum EmotionalState
    {
        Neutral,
        Focused,
        Excited,
        Confused,
        Frustrated,
        Accomplished,
        Reflective
    }
}
```

## Character Types

### Player Character

Fully customizable avatar representing the player:

- Extensive customization options
- Adapts to player's preferred movement style
- Frequency visualization reflects learning approach
- Grows and evolves with player progression

### Realm Guardians

The five specialized mentors with unique visual identities:

- Distinctive appearance tied to their domain
- Specialized animation sets for their teaching style
- Domain-specific frequency visualization
- Interactive elements for their educational role

### Chancellor Andy

The Academy's guardian with a calming presence:

- Gentle, deliberate movement style
- Subtle frequency that influences the environment
- Interactive animations for mentorship moments
- Adaptive positioning for accessibility during dialogues

### Dr. Natalie

The Chief Mind Mapper with analytical presence:

- Precise, intentional movements
- Complex, multi-layered frequency visualization
- Scientific observation animations
- Inclusive interaction patterns for all player types

### Daisy

The Reality Shaper with energetic creativity:

- Dynamic, variable-paced movements reflecting ADHD
- Vibrant, swirling frequency visualization
- Creative gesture animations for shaping reality
- Expressive emotional state visualization

### Winnie

The Academy consciousness in cloud form:

- Fluid, non-humanoid movement system
- Shape-shifting animations for different functions
- Reactive frequency that mirrors player emotions
- Accessibility-focused interaction animations

### Student NPCs

Diverse population of the Academy:

- Varied body types, abilities, and appearances
- Wide range of movement styles and assistive devices
- Unique frequency patterns showing different neurotypes
- Natural interaction animations with inclusive design

## Accessibility-First Animation System

### Multiple Animation Sets

Each character action has variations for different abilities:

#### Movement Variations

- **Standard Walking**: Traditional bipedal locomotion
- **Wheelchair Movement**: Manual and powered wheelchair animations
- **Mobility Aid Movement**: Crutches, walkers, canes, prosthetics
- **Alternative Movement**: Floating, teleportation, unique methods

#### Interaction Variations

- **Standard Interaction**: Traditional hand/arm-based interaction
- **Alternative Interaction**: Head movement, voice activation, assistive device
- **Proximity Interaction**: Body positioning for those with limited range
- **Adaptive Interaction**: System determines best method based on character

#### Communication Variations

- **Verbal Communication**: Standard speaking animations
- **Sign Language**: Accurate signing animations for conversations
- **AAC Device**: Animations showing use of communication devices
- **Non-verbal**: Body language and expression-based communication

```csharp
// Example of animation variation system
[System.Serializable]
public class AnimationVariationSet
{
    public string actionName;            // The action being performed
    public AnimationClip standardAnimation;  // Default animation

    // Specialized variations
    public AnimationClip wheelchairVariation;
    public AnimationClip mobilityAidVariation;
    public AnimationClip alternativeControlVariation;

    public AnimationClip GetAppropriateVariation(MovementStyle style)
    {
        switch(style)
        {
            case MovementStyle.Walking:
                return standardAnimation;
            case MovementStyle.Wheelchair:
                return wheelchairVariation;
            case MovementStyle.MobilityAid:
                return mobilityAidVariation;
            case MovementStyle.CustomMovement:
            case MovementStyle.FreeFloating:
                return alternativeControlVariation;
            default:
                return standardAnimation;
        }
    }
}
```

### Procedural Animation System

Dynamic adjustments to animations based on character configuration:

- **Assistive Device Integration**: Automatically adapts animations to work with devices
- **Height Adjustment**: Scales interaction points for different character heights
- **Reach Modification**: Adjusts interaction distances based on mobility
- **Speed Variation**: Personalized movement pacing for different abilities

```csharp
// Pseudo-code for procedural animation adjustment
public void AdjustAnimationForDevice(Animator animator, string deviceType)
{
    // Get base animation parameters
    var baseParams = GetBaseAnimationParameters();

    // Apply device-specific adjustments
    switch(deviceType)
    {
        case "wheelchair_manual":
            // Adjust upper body strength for manual wheelchair
            animator.SetLayerWeight(upperBodyLayer, 1.2f);
            // Modify turn radius and movement patterns
            SetWheelchairMovementParameters(animator, false);
            break;

        case "wheelchair_powered":
            // Different parameters for powered wheelchair
            animator.SetLayerWeight(upperBodyLayer, 1.0f);
            SetWheelchairMovementParameters(animator, true);
            break;

        case "crutches":
            // Adjust for crutch movement patterns
            SetCrutchMovementParameters(animator);
            break;

        // Other device types...
    }

    // Apply general accessibility adjustments
    AdjustReachParameters(animator);
    AdjustInteractionDistances(animator);
}
```

### Emotional Expression System

Inclusive representation of different emotional expression styles:

- **Neurodivergent Expressions**: Authentic representations of diverse emotional displays
- **Intensity Controls**: Adjustable intensity for sensory considerations
- **Alternative Indicators**: Non-facial emotional indicators for different preferences
- **Cultural Variations**: Culturally diverse emotional expression patterns

### Transition System

Smooth changes between different movement modes:

- **Mode Switching**: Transitions between walking, device use, and alternative movement
- **Contextual Adaptation**: Environment-aware movement style changes
- **Fatigue Representation**: Optional realistic fatigue factors for movement
- **Preference Memory**: System remembers player's preferred transitions

## Character Customization System

### Inclusive Avatar Creation

Comprehensive options representing diverse identities:

#### Body Representation

- **Body Types**: Wide range of body shapes and sizes
- **Height Variation**: Full spectrum from very short to very tall
- **Age Representation**: Visual options from teenager to elder
- **Ability Representation**: Options for visible and invisible disabilities

#### Cultural Expression

- **Skin Tones**: Comprehensive range of realistic skin colors
- **Hair Styles**: Diverse hair textures, styles, and colors
- **Cultural Clothing**: Respectful options for cultural expression
- **Religious Items**: Options for religious expression where appropriate

#### Assistive Technology

- **Mobility Devices**: Wheelchairs, walkers, canes, crutches, prosthetics
- **Sensory Aids**: Hearing aids, white canes, service animals
- **Communication Devices**: AAC devices, communication boards
- **Other Aids**: Fidget tools, support items, medical devices

#### Personal Expression

- **Clothing Styles**: Diverse fashion options for self-expression
- **Accessories**: Jewelry, bags, personal items
- **Color Themes**: Customizable color schemes for all elements
- **Special Items**: Unique objects reflecting interests and personality

### Frequency Customization

Visual representation of player's learning style:

- **Pattern Selection**: Base pattern reflecting primary learning approach
- **Color Theme**: Colors representing emotional/energetic tendencies
- **Intensity Setting**: Visual strength based on player preference
- **Interactive Elements**: How the frequency responds to environment

### Animation Preference Settings

Player control over their avatar's movement style:

- **Primary Movement**: Default movement method selection
- **Situational Preferences**: Context-specific movement choices
- **Interaction Style**: Preferred methods for environmental interaction
- **Communication Style**: How the avatar expresses communication

## NPC Character System

### Guardian Character Design

Specialized design for the five realm guardians:

#### Nefzu - Voice Weaver

- **Visual Design**: Flowing garments with sound-wave patterns
- **Movement Style**: Rhythmic, dance-like movements
- **Frequency Effect**: Ribbon-like strands that form words and shapes
- **Special Animations**: Communication teaching, language visualization

#### Ernie - Story Architect

- **Visual Design**: Book-inspired elements and narrative symbols
- **Movement Style**: Theatrical, expressive movements
- **Frequency Effect**: Page-like projections with moving text
- **Special Animations**: Story creation, narrative environment building

#### Frida - Pattern Dancer

- **Visual Design**: Geometric patterns and mathematical symbols
- **Movement Style**: Precise, pattern-based movements
- **Frequency Effect**: Floating mathematical visualizations
- **Special Animations**: Pattern creation, mathematical demonstrations

#### Tux - Code Whisperer

- **Visual Design**: Digital-inspired elements with code aesthetics
- **Movement Style**: Efficient, logical movements
- **Frequency Effect**: Code-like projections and computational visualizations
- **Special Animations**: Programming demonstrations, digital creation

#### Simone - Pathway Builder

- **Visual Design**: Map-inspired elements with path symbols
- **Movement Style**: Confident movements showcasing Down syndrome
- **Frequency Effect**: Glowing pathways that form between points
- **Special Animations**: Path creation, navigation assistance

### Academy Entity Characters

Non-human manifestations of the Academy itself:

#### Living Architecture

- **Visual Design**: Building elements with consciousness
- **Movement Style**: Architectural transformation animations
- **Interaction System**: Responsive to player proximity and needs
- **Accessibility Features**: Adapts physically to provide access

#### Memory Flora

- **Visual Design**: Plant-like entities storing knowledge
- **Movement Style**: Organic growth and response animations
- **Interaction System**: Blooms to reveal information when approached
- **Accessibility Features**: Multiple interaction methods (visual, audio, tactile)

## Frequency Visualization System

### Player Frequency Design

Visual representation of player's unique learning profile:

- **Visual Style**: Particle-based aura surrounding the player
- **Color Coding**: Colors representing learning strengths and preferences
- **Pattern Language**: Shapes indicating thinking styles and approaches
- **Evolution System**: Changes reflecting growth and development

### Frequency Interaction System

How frequencies interact between characters:

- **Harmony Visualization**: Visual effects when compatible frequencies meet
- **Collaboration Effects**: Special patterns during group activities
- **Mentorship Dynamics**: Visual representation of teaching/learning relationships
- **Emotional Response**: Frequency changes based on emotional state

### Frequency Abilities

Special capabilities tied to frequency development:

- **Environmental Influence**: Affecting Academy spaces through frequency
- **Communication Method**: Non-verbal communication through frequency patterns
- **Perception Enhancement**: Revealing hidden elements based on frequency type
- **Special Movements**: Unique mobility options unlocked by frequency development

## Technical Implementation Notes

### Animation Performance Optimization

- Implement LOD system for animation complexity
- Use animation instancing for groups of NPCs
- Optimize procedural calculations through caching
- Consider animation compression for memory efficiency

### Accessibility Testing Protocol

- Regular testing with diverse user groups
- Validation by accessibility consultants
- Comprehensive options for animation sensitivity
- Continuous feedback implementation system

### Art Pipeline Considerations

- Establish consistent rig structure for all characters
- Create modular animation system for easy variation
- Develop clear guidelines for inclusive character design
- Implement efficient texture atlas system for customization

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)

- Basic character controller implementation
- Core animation system architecture
- Standard movement animations
- Initial customization system prototype

### Phase 2: Accessibility Focus (Weeks 5-8)

- Wheelchair movement animation set
- Mobility aid animation set
- Alternative interaction animations
- Basic procedural animation adjustments

### Phase 3: Character Identity (Weeks 9-12)

- Complete avatar customization system
- Diverse NPC generation system
- Guardian character implementations
- Initial frequency visualization system

### Phase 4: Polish & Refinement (Weeks 13-16)

- Animation transition improvements
- Emotional expression system completion
- Frequency interaction effects
- Performance optimization and testing
