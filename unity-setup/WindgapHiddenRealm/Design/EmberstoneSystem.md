# Emberstone Token System

## Technical Specification Document

## Overview

The Emberstone system is the core reward and progression mechanic in Windgap Academy: The Hidden Realm. These magical stones form naturally when players make genuine progress or help others learn, representing different aspects of personal growth and achievement.

## System Architecture

### Core Components

#### 1. EmberstoneManager

Central system responsible for managing all Emberstone-related functionality:

- Tracks player's collection of stones
- Handles stone creation and awarding
- Manages stone combination and usage
- Provides API for UI and other systems

#### 2. EmberstoneDefinitions

Scriptable object database containing information about each stone type:

- Visual appearance and particle effects
- Acquisition requirements
- Unlock capabilities
- Narrative descriptions

#### 3. EmberstoneInventory

Player-specific component tracking owned Emberstones:

- Collection status
- Usage history
- Favorite stones
- Custom combinations

#### 4. EmberstoneEffects

System handling the visual and gameplay effects of stones:

- Particle systems for stone activation
- Environmental changes triggered by stones
- Avatar modifications from stone usage
- Sound effects and haptic feedback

### Data Structure

```csharp
// Emberstone Type Definition
[System.Serializable]
public class EmberstoneType
{
    public string id;                    // Unique identifier
    public string displayName;           // User-facing name
    public string description;           // Narrative description
    public Color primaryColor;           // Main color
    public Color secondaryColor;         // Accent/glow color
    public GameObject prefab;            // 3D model
    public ParticleSystem activationEffect;  // Effect when used
    public AudioClip activationSound;    // Sound when used
    public Sprite inventoryIcon;         // 2D inventory representation
    public List<string> unlockableFeatures;  // Features this stone unlocks
    public int rarityTier;               // How rare/valuable the stone is
}

// Player Emberstone Inventory Entry
[System.Serializable]
public class EmberstoneInventoryItem
{
    public string emberstoneTypeId;      // Reference to type
    public int quantity;                 // How many the player has
    public DateTime firstAcquired;       // When first earned
    public List<DateTime> acquisitionDates; // All times earned
    public int timesUsed;                // Usage counter
    public bool isFavorite;              // Player-marked favorite
    public float powerLevel;             // Stone's strength (may grow with use)
    public Dictionary<string, object> customProperties; // Extensible properties
}
```

## Emberstone Types

### 1. Ochre Emberstone

- **ID**: `ochre_emberstone`
- **Represents**: Resilience and persistence
- **Earned by**: Completing long-term goals or returning after setbacks
- **Visual**: Deep red with earthy undertones and slow-burning veins
- **Particle Effect**: Warm, rising embers with orange glow
- **Sound Effect**: Deep, resonant hum
- **Unlocks**: Advanced learning modules, Calm Space desert scenes

### 2. Quartz Emberstone

- **ID**: `quartz_emberstone`
- **Represents**: Clarity and insight
- **Earned by**: Reflective journaling, emotional regulation, self-awareness tasks
- **Visual**: Smoky grey with shimmering crystal flecks
- **Particle Effect**: Crystalline shards that catch light
- **Sound Effect**: Clear, high-pitched chime
- **Unlocks**: Guided meditations, avatar aura upgrades

### 3. Basalt Emberstone

- **ID**: `basalt_emberstone`
- **Represents**: Grounded strength and stability
- **Earned by**: Consistent effort across multiple domains
- **Visual**: Matte black with subtle glowing cracks
- **Particle Effect**: Solid waves emanating from stone
- **Sound Effect**: Low, stable tone
- **Unlocks**: Cross-domain challenges, Calm Space grounding tools

### 4. Opal Emberstone

- **ID**: `opal_emberstone`
- **Represents**: Creativity and transformation
- **Earned by**: Completing creative tasks, problem-solving, or peer collaboration
- **Visual**: Iridescent with shifting colors (blue, green, pink)
- **Particle Effect**: Rainbow prism light patterns
- **Sound Effect**: Melodic sequence of tones
- **Unlocks**: Avatar customization, artistic mini-games

### 5. Sandstone Emberstone

- **ID**: `sandstone_emberstone`
- **Represents**: Connection and empathy
- **Earned by**: Supporting peers, engaging in community learning
- **Visual**: Warm beige with soft glowing swirls
- **Particle Effect**: Connecting light strands
- **Sound Effect**: Gentle wind chimes
- **Unlocks**: Peer challenge features, shared Calm Space scenes

### 6. Lightning Emberstone

- **ID**: `lightning_emberstone`
- **Represents**: Breakthroughs and bold action
- **Earned by**: Completing difficult tasks quickly or taking initiative
- **Visual**: Charcoal stone with electric blue veins
- **Particle Effect**: Electric arcs and sparks
- **Sound Effect**: Electric crackle
- **Unlocks**: Fast-track missions, energizing Calm Space tools

## Acquisition Logic

### Trigger Conditions

Emberstones are awarded based on specific player achievements and behaviors:

#### Example: Ochre Emberstone (Resilience)

```csharp
// Pseudo-code for awarding Ochre Emberstone
public void CheckForOchreEmberstoneAward(Player player)
{
    // Check if player returned to a challenge after previous failure
    bool returnedAfterFailure = player.GetFailedChallenges()
        .Any(c => c.IsActive && c.PreviousAttempts > 1);

    // Check if long-term goal was completed
    bool completedLongTermGoal = player.GetGoals()
        .Any(g => g.IsCompleted && g.Duration > TimeSpan.FromDays(7));

    // Award stone if either condition is met
    if (returnedAfterFailure || completedLongTermGoal)
    {
        EmberstoneManager.Instance.AwardEmberstone("ochre_emberstone",
            "You've shown remarkable persistence!");
    }
}
```

### Award Sequence

When a player earns an Emberstone:

1. Trigger event detected in relevant gameplay system
2. EmberstoneManager validates achievement criteria
3. Visual and audio effects play near player
4. Stone appears and floats to inventory
5. UI notification displays with congratulatory message
6. New abilities or areas unlock if applicable
7. Achievement recorded in player profile

## Usage Mechanics

### Individual Stone Usage

Players can activate stones for specific benefits:

```csharp
// Using a single stone
public void UseEmberstone(string emberstoneTypeId)
{
    // Check if player has this stone
    if (HasEmberstone(emberstoneTypeId))
    {
        // Get stone definition
        var stoneDef = GetEmberstoneDefinition(emberstoneTypeId);

        // Apply effects
        ApplyEmberstoneEffects(stoneDef);

        // Update usage counter
        IncrementUsageCount(emberstoneTypeId);

        // Activate any unlockable features
        ActivateUnlockableFeatures(stoneDef.unlockableFeatures);
    }
}
```

### Stone Combinations

Players can combine stones for enhanced effects:

#### Example: Calm Focus Combination

- **Components**: Quartz + Basalt Emberstones
- **Effect**: Creates a personal study space with optimized focus conditions
- **Visual**: Grey-black crystalline structure with pulsing inner light
- **Duration**: 10 minutes of real-time enhanced focus conditions

```csharp
// Combining stones
public void CombineEmberstones(List<string> emberstoneTypeIds, string combinationName)
{
    // Check if player has all required stones
    if (HasAllEmberstones(emberstoneTypeIds))
    {
        // Get combination definition
        var combinationDef = GetCombinationDefinition(combinationName);

        // Apply combination effect
        ApplyCombinationEffect(combinationDef);

        // Update usage counters for all stones
        foreach (var stoneId in emberstoneTypeIds)
        {
            IncrementUsageCount(stoneId);
        }
    }
}
```

## UI Integration

### Emberstone Inventory View

- Grid layout showing all collected stones
- Visual indicators of quantity
- Glow effect for newly acquired stones
- Filter options by type, rarity, or usage
- Sort options by acquisition date or frequency

### Stone Inspection View

- 3D model viewer with rotation controls
- Animation of stone's unique effects
- Description text and acquisition source
- List of unlockable features
- Usage history and statistics

### Combination Interface

- Drag-and-drop stone selection
- Preview of combination results
- Effect description and duration information
- Favorites system for commonly used combinations

## Educational Integration

### Learning Progress Mapping

Emberstones visually represent educational progress:

- Connect to specific learning objectives and skills
- Grow in intensity as skills develop
- Provide tangible representation of abstract growth

### Reflection Prompts

When awarding stones, prompt meaningful reflection:

- Questions about the process of achievement
- Connections to other skills and knowledge
- Real-world applications of demonstrated abilities

### Teacher Dashboard Integration

Optional system for educators to track student progress:

- Visual representation of Emberstone collection
- Timeline of achievements and milestones
- Areas of strength and growth opportunities
- Suggested next challenges based on stone collection

## Technical Implementation Notes

### Performance Considerations

- Implement object pooling for stone particle effects
- Use LOD system for stone models based on view distance
- Optimize combination effects for lower-end hardware
- Consider async loading for stone definition database

### Persistence Strategy

- Save Emberstone inventory with player profile
- Use incremental updates to minimize save data size
- Implement data integrity checks for stone quantity
- Create backup system for stone collection recovery

### Accessibility Features

- Provide haptic feedback alternatives to visual effects
- Include audio descriptions of stone appearance
- Ensure color choices work with colorblind options
- Implement keyboard/alternative input for stone manipulation

## Future Expansion Possibilities

### New Stone Types

Framework for adding additional stone types:

- Expansion stone type template
- Integration with existing combination system
- Balance considerations for new unlockables

### Community Stones

Special stones earned through community contribution:

- Peer teaching awards
- Content creation recognition
- Community event participation
- Mentorship achievements

### Real-world Integration

Connect virtual stones to real-world accomplishments:

- API for education system integration
- Digital certificates tied to stone collections
- Physical representations (3D printable models)
- Augmented reality visualization

## Implementation Schedule

### Phase 1: Core System (Weeks 1-3)

- Basic EmberstoneManager implementation
- Definition system for initial stone types
- Inventory tracking and persistence
- Simple award triggers for testing

### Phase 2: Visual Implementation (Weeks 4-6)

- 3D models and textures for all stone types
- Particle effects and animations
- UI inventory and inspection views
- Sound design and integration

### Phase 3: Gameplay Integration (Weeks 7-10)

- Award trigger implementation in all relevant systems
- Unlockable content connections
- Combination system implementation
- Player tutorial and documentation

### Phase 4: Educational Features (Weeks 11-14)

- Reflection prompt system
- Learning objective connections
- Progress visualization tools
- Optional educator interface
