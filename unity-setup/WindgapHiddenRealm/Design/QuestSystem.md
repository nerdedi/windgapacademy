# Quest System Design

## Technical Specification Document

## Overview

The Quest System in Windgap Academy: The Hidden Realm provides a structured framework for educational progression through narrative-driven challenges. This system transforms learning objectives into engaging storylines that adapt to individual learning styles, abilities, and interests. Every quest is designed with multiple completion paths to accommodate diverse learning approaches and accessibility needs.

## System Architecture

### Core Components

#### 1. QuestManager

Central system responsible for managing all quest-related functionality:

- Tracks active and completed quests
- Manages quest progression and state changes
- Coordinates quest rewards and consequences
- Provides API for other systems to interact with quests

#### 2. AdaptiveDifficultySystem

Dynamically adjusts quest parameters based on player performance:

- Monitors success/failure rates on similar challenges
- Scales complexity based on player's learning profile
- Offers appropriate scaffolding for different abilities
- Provides multiple success paths with equivalent outcomes

#### 3. NarrativeEngine

Manages the storytelling aspects of quests:

- Generates contextual dialogue and descriptions
- Maintains narrative coherence across quest chains
- Adapts story presentation to player preferences
- Coordinates character involvement in quest events

#### 4. RewardSystem

Handles the distribution and tracking of quest rewards:

- Manages Emberstone tokens earned through quests
- Tracks skill development and knowledge acquisition
- Provides meaningful feedback on achievement
- Supports diverse recognition methods for accomplishment

### Data Structure

```csharp
// Quest Definition
[System.Serializable]
public class QuestDefinition
{
    public string id;                      // Unique identifier
    public string title;                   // Display title
    public string description;             // Quest description

    public QuestCategory category;         // Academic domain
    public QuestDifficulty baseDifficulty; // Initial difficulty setting
    public QuestType type;                 // Structure type

    public List<QuestObjective> objectives; // Required goals
    public List<QuestReward> rewards;      // Completion rewards

    public List<string> prerequisiteQuestIds; // Required prior quests
    public List<string> followupQuestIds;   // Unlocked quests

    public List<AdaptationParameter> adaptationParameters; // Difficulty scaling
    public List<AccessibilityOption> accessibilityOptions; // Alt methods

    // Domain categories
    public enum QuestCategory
    {
        VoiceRealm,      // Language/communication
        NarrativeRealm,   // Reading/writing
        PatternRealm,     // Mathematics/logic
        CodeRealm,        // Computer science
        PathwayRealm,     // Life skills/executive function
        IntegratedRealm   // Cross-domain
    }

    // Difficulty levels
    public enum QuestDifficulty
    {
        Introductory,    // Basic concepts
        Foundational,    // Core knowledge
        Intermediate,    // Applied knowledge
        Advanced,        // Complex integration
        Mastery          // Creative application
    }

    // Quest structure types
    public enum QuestType
    {
        Tutorial,        // Guided introduction
        Exploration,     // Open-ended discovery
        Challenge,       // Skill application
        Collaboration,   // Group-based
        Creation,        // Building/making
        Integration      // Cross-domain application
    }
}

// Quest Objective
[System.Serializable]
public class QuestObjective
{
    public string id;                  // Unique identifier
    public string description;         // What to accomplish

    public ObjectiveType type;         // How it's measured
    public int targetValue;            // Completion threshold
    public bool isOptional;            // Required for completion?

    public List<CompletionMethod> completionMethods; // Alternative ways to complete
    public List<ScaffoldingOption> scaffoldingOptions; // Progressive assistance

    // Types of objectives
    public enum ObjectiveType
    {
        Discover,        // Find/interact with something
        Collect,         // Gather items/information
        Create,          // Make something new
        Solve,           // Find a solution
        Demonstrate,     // Show a skill
        Teach,           // Explain to others
        Transform        // Change something
    }
}

// Completion Method
[System.Serializable]
public class CompletionMethod
{
    public string id;                  // Unique identifier
    public string description;         // How to complete

    public AccessibilityProfile targetProfile; // Suited for
    public InteractionType primaryInteraction; // Main interaction

    public List<string> requiredTools; // Tools needed
    public float difficultyModifier;   // Relative challenge

    // Interaction types
    public enum InteractionType
    {
        Physical,        // Movement/positioning
        Verbal,          // Speaking/listening
        Visual,          // Seeing/watching
        Tactile,         // Touch/feel
        Cognitive,       // Thinking/problem-solving
        Social,          // Interpersonal
        Alternative      // Custom approach
    }
}

// Quest Instance (runtime)
public class QuestInstance : MonoBehaviour
{
    public string questDefinitionId;   // Reference to definition
    public QuestState currentState;    // Current progress

    public Dictionary<string, ObjectiveState> objectiveStates; // Progress tracking
    public List<AdaptationAdjustment> activeAdaptations; // Current modifications

    public DateTime startTime;         // When quest began
    public int attemptCount;           // Number of tries

    public float currentDifficultyModifier; // Dynamic difficulty
    public List<string> selectedCompletionMethods; // User choices

    // Quest progress states
    public enum QuestState
    {
        Available,       // Can be started
        Active,          // In progress
        Completed,       // Successfully finished
        Failed,          // Unsuccessful attempt
        Abandoned,       // Voluntarily quit
        Locked           // Prerequisites not met
    }
}

// Objective State (runtime)
[System.Serializable]
public class ObjectiveState
{
    public string objectiveId;         // Reference to definition
    public int currentValue;           // Progress toward target
    public bool isComplete;            // Finished flag

    public string activeCompletionMethodId; // Current approach
    public List<string> activeScaffoldingIds; // Active helps

    public List<AttemptRecord> attempts; // History of tries
    public Dictionary<string, object> customData; // Objective-specific data
}
```

## Quest Types

### Tutorial Quests

Guided introductions to new concepts or skills:

- Step-by-step instructions with clear feedback
- Multiple sensory channels for instructions (visual, audio, etc.)
- Adjustable pacing based on learner needs
- Progressive reduction of scaffolding

### Exploration Quests

Open-ended discovery of knowledge domains:

- Self-directed investigation with flexible goals
- Multiple navigation options (spatial, list-based, narrative)
- Interest-driven path selection
- Built-in knowledge scaffolding for context

### Challenge Quests

Application of skills to solve specific problems:

- Multiple difficulty levels dynamically available
- Time-optional completion parameters
- Various input methods for solutions
- Contextual hints and supports

### Collaboration Quests

Group-based activities requiring cooperation:

- Role options based on different abilities and strengths
- Multiple communication channels between participants
- Synchronized and asynchronous participation options
- Balanced contribution mechanics

### Creation Quests

Building or making something original:

- Diverse creation tools with equivalent outcomes
- Multiple expression methods (visual, verbal, code, etc.)
- Template options for different starting points
- Flexible evaluation criteria

### Integration Quests

Cross-domain application of multiple skills:

- Personalized connection to previous learning
- Multiple paths to demonstrate connections
- Choice of expression domains
- Scaffolded integration support

## Adaptive Quest System

### Learning Profile Integration

How quests adapt to individual learning styles:

#### Sensory Preference Adaptation

- **Visual Learners**: Enhanced visual cues and spatial representations
- **Auditory Learners**: Verbal instructions and sound-based feedback
- **Kinesthetic Learners**: Interactive manipulation and movement-based activities
- **Reading/Writing Learners**: Text-rich options and written expression paths

#### Cognitive Style Adaptation

- **Sequential Processors**: Step-by-step structured approaches
- **Global Processors**: Context-first, big picture approaches
- **Analytical Thinkers**: Logic-based, component-focused options
- **Creative Thinkers**: Open-ended, innovation-focused options

#### Accessibility Adaptation

- **Motor Considerations**: Alternative input methods and timing adjustments
- **Visual Considerations**: High contrast, screen reader support, size scaling
- **Auditory Considerations**: Visual alternatives, captioning, noise reduction
- **Cognitive Considerations**: Memory aids, attention supports, complexity scaling

```csharp
// Adaptation parameter system
[System.Serializable]
public class AdaptationParameter
{
    public string parameterId;         // What can be adjusted
    public float defaultValue;         // Starting value
    public float minValue;             // Lower limit
    public float maxValue;             // Upper limit

    public AdaptationTrigger trigger;  // When to adjust
    public float adjustmentRate;       // How quickly to change

    public bool isAccessibilityRelated; // Affects access
    public string relatedLearningDimension; // Learning style

    // When to trigger adaptations
    public enum AdaptationTrigger
    {
        OnSuccess,       // After achievements
        OnFailure,       // After difficulties
        OnTime,          // Based on timing
        OnPatternDetected, // Learning pattern
        OnUserRequest    // Manual adjustment
    }
}

// Runtime adaptation adjustment
[System.Serializable]
public class AdaptationAdjustment
{
    public string parameterId;         // What's being adjusted
    public float currentValue;         // Current setting
    public List<AdjustmentRecord> history; // Change log

    public bool isUserOverridden;      // Manual override
    public DateTime lastAdjustmentTime; // When last changed
}
```

### Difficulty Scaling System

Dynamic adjustment of challenge levels:

- **Complexity Scaling**: Adjusts number of steps or concepts involved
- **Time Flexibility**: Modifies time pressures or requirements
- **Feedback Frequency**: Changes how often guidance is provided
- **Scaffolding Levels**: Adds or removes supporting structures
- **Success Threshold**: Adjusts criteria for successful completion

### Multi-Path Progression

Support for different approaches to completion:

- **Equivalent Outcomes**: Multiple methods yield same rewards
- **Strength-Based Options**: Paths aligned with player strengths
- **Interest-Driven Choices**: Options based on topic preferences
- **Accessibility-Centered Paths**: Routes designed for specific needs
- **Progressive Challenge**: Optional increasing difficulty paths

## Quest Generation System

### Procedural Quest Creation

System for dynamically generating appropriate quests:

- **Template-Based Generation**: Structured formats with variable content
- **Learning Objective Mapping**: Alignment with educational goals
- **Progression-Aware**: Generation based on player's development
- **Interest-Responsive**: Content tailored to demonstrated interests
- **Adaptive Challenge**: Difficulty calibrated to recent performance

```csharp
// Quest template for procedural generation
[System.Serializable]
public class QuestTemplate
{
    public string templateId;          // Template identifier
    public QuestType questType;        // Structure type
    public QuestCategory category;     // Domain area

    public string titlePattern;        // Title format
    public string descriptionPattern;  // Description format

    public List<ObjectiveTemplate> objectiveTemplates; // Possible objectives
    public List<RewardTemplate> rewardTemplates; // Possible rewards

    public ContentTagRequirements contentTags; // Required content
    public ProgressionRequirements progressionReqs; // Player stage reqs

    // Content requirements for generation
    [System.Serializable]
    public class ContentTagRequirements
    {
        public List<string> requiredTags; // Must include
        public List<string> optionalTags; // Could include
        public List<string> excludedTags; // Must not include
    }
}

// Objective template for procedural generation
[System.Serializable]
public class ObjectiveTemplate
{
    public ObjectiveType type;         // How it's measured
    public string descriptionPattern;  // Description format

    public IntRange targetValueRange;  // Possible targets
    public float optionalProbability;  // Chance to be optional

    public List<CompletionMethodTemplate> methodTemplates; // Possible methods
}
```

### Educational Alignment System

Connection between quests and learning objectives:

- **Curriculum Mapping**: Links to established educational standards
- **Skill Progression Tracking**: Monitors development of specific abilities
- **Knowledge Graph Integration**: Places quest in conceptual framework
- **Assessment Alignment**: Provides evaluation data on learning
- **Metacognitive Development**: Supports awareness of learning process

### Narrative Integration System

Embedding quests within the game's storytelling:

- **Character-Driven Quests**: Connected to specific NPCs and their stories
- **World-Building Integration**: Reveals aspects of the Academy lore
- **Personal Journey Mapping**: Connects to player's individual story
- **Thematic Coherence**: Aligns with realm-specific themes and concepts
- **Emotional Engagement**: Designed to create meaningful connections

## Quest Tracking System

### Progress Visualization

Methods for representing quest advancement:

- **Journey Maps**: Spatial representation of quest progress
- **Achievement Trees**: Hierarchical display of accomplishments
- **Narrative Journals**: Story-based recording of experiences
- **Skill Constellations**: Visual mapping of developed abilities
- **Multiple Formats**: Simultaneous text, visual, and auditory tracking

### Feedback Systems

Mechanisms for providing response to quest activities:

- **Multi-Sensory Feedback**: Visual, audio, and haptic responses
- **Progress Indicators**: Clear signals of advancement
- **Formative Guidance**: Supportive direction during attempts
- **Celebratory Recognition**: Meaningful acknowledgment of success
- **Growth Orientation**: Focus on development rather than failure

### Reflection Tools

Support for metacognitive processing:

- **Guided Reflection Questions**: Prompts for thinking about learning
- **Process Documentation**: Recording of approaches and strategies
- **Connection Mapping**: Visualizing links between knowledge areas
- **Self-Assessment Tools**: Structured evaluation of own learning
- **Future Planning**: Using insights to inform next steps

## Reward System

### Emberstone Integration

Connection to the token-based progression system:

- **Domain-Specific Tokens**: Rewards aligned with realm categories
- **Skill-Based Bonuses**: Additional tokens for demonstrating specific abilities
- **Collection Visualization**: Multiple ways to track and display earned tokens
- **Exchange Mechanics**: Using tokens to unlock new opportunities
- **Achievement Recognition**: Special tokens for significant accomplishments

### Knowledge Unlocks

Access to new information and capabilities:

- **Concept Revelations**: Exposing previously hidden knowledge
- **Tool Access**: Gaining use of new capabilities and resources
- **Area Unlocks**: Opening previously inaccessible Academy locations
- **Character Interactions**: Unlocking new dialogue and relationship options
- **Metacognitive Insights**: Special revelations about learning itself

### Personalized Recognition

Individualized acknowledgment of achievement:

- **Strength Recognition**: Celebration of specific aptitudes
- **Growth Highlighting**: Acknowledgment of personal development
- **Interest Reinforcement**: Rewards aligned with demonstrated preferences
- **Multiple Recognition Modes**: Various forms of acknowledgment
- **Privacy-Aware Options**: Choices about public vs. private recognition

## Technical Implementation Notes

### Quest State Persistence

- Save data structure for preserving quest progress
- Cloud synchronization for cross-device continuity
- Graceful handling of interrupted quests
- Historical record maintenance for learning patterns

### Performance Considerations

- Efficient quest tracking for large numbers of simultaneous quests
- Optimization of procedural generation system
- Smart loading of quest-related resources
- Memory management for quest history

### Analytics Integration

- Learning data collection for educational insights
- Anonymized pattern analysis for system improvement
- Completion rate monitoring across different paths
- Difficulty calibration based on population data

## Development Roadmap

### Phase 1: Foundation (Weeks 1-4)

- Basic quest management system
- Core quest types implementation
- Simple reward distribution system
- Initial quest tracking UI

### Phase 2: Adaptation (Weeks 5-8)

- Learning profile integration
- Difficulty scaling system
- Multi-path progression options
- Accessibility adaptations

### Phase 3: Generation (Weeks 9-12)

- Procedural quest creation system
- Educational alignment framework
- Narrative integration system
- Advanced reward mechanics

### Phase 4: Polish & Refinement (Weeks 13-16)

- Progress visualization improvements
- Feedback system enhancements
- Reflection tools implementation
- Analytics and data insights
