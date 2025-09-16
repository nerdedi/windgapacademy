# Windgap Academy Quest System

## Overview

The Quest System manages all player quests, objectives, and rewards. It is designed for accessibility and Universal Design for Learning (UDL), supporting screen readers, visual cues, and flexible quest structures.

## Key Components

- `Quest`: Base class for quests (ID, name, description, objectives, rewards, completion state)
- `QuestObjective`: Represents a single quest objective
- `QuestManager`: Singleton managing all, active, and completed quests
- `QuestUI`: Handles quest display and accessibility features
- `QuestEvents`: UnityEvents for quest progress and completion
- `QuestAccessibility`: Accessibility hooks (screen reader, haptics, etc.)
- `QuestSampleData`: Example quests for testing

## Accessibility Features

- All quest and objective text is available for screen readers
- Visual and audio cues for quest progress
- Events for integration with haptics and external accessibility systems

## Usage

1. Add `QuestManager` to a persistent GameObject in your scene.
2. Use `QuestSampleData` to generate sample quests for testing.
3. Connect `QuestUI` to your UI Canvas and link text fields/buttons.
4. Use `QuestAccessibility` to announce quest progress.

## Example

```csharp
var questManager = QuestManager.Instance;
var sampleData = new QuestSampleData();
foreach (var quest in sampleData.GetSampleQuests())
    questManager.AddQuest(quest);
```

## Extending

- Add new quest types by subclassing `Quest`.
- Add new accessibility hooks in `QuestAccessibility`.
- Integrate with analytics or achievement systems via `QuestEvents`.
