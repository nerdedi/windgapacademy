# AI Assistant Integration

This document provides an overview of the AI Assistant integration for Windgap Academy, particularly focusing on its use in AAC (Augmentative and Alternative Communication) features.

## Features

The AI Assistant integration provides the following capabilities:

1. **Sentence Construction**: Transforms simple words or communication symbols into natural-sounding sentences.
2. **Grammar Correction**: Identifies and corrects grammatical errors in text.
3. **Symbol Interpretation**: Interprets meaning from a sequence of communication symbols.

## Architecture

The AI Assistant integration consists of several components:

- **AIAssistantService**: A service layer that handles communication with the OpenAI API and manages user context and preferences.
- **AIAssistant Component**: A React component for displaying the AI Assistant interface.
- **useAIAssistant Hook**: A custom hook for using AI Assistant capabilities throughout the application.

## Technical Implementation

### OpenAI Integration

The integration uses OpenAI's API for natural language processing. The service is configured through environment variables:

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_BASE_URL=https://api.openai.com/v1
```

### User Context and Personalization

The AI Assistant maintains user context to provide personalized responses:

- **User Preferences**: Sentence complexity, grammar correction settings, vocabulary level
- **Conversation History**: Recent interactions for context-aware responses
- **Learning Profile**: Information about the user's learning style and needs

Data is stored in Firestore under the user's document:

```
users/{userId}/aiPreferences
users/{userId}/aiConversationHistory
```

## Usage Examples

### Sentence Construction

```javascript
import useAIAssistant from "../hooks/useAIAssistant";

// Inside a component
const { constructSentence, isLoading } = useAIAssistant();

// Usage
const handleConstruct = async () => {
  const symbols = ["I", "want", "go", "outside"];
  const result = await constructSentence(symbols);
  console.log(result.sentence); // "I want to go outside."
};
```

### Grammar Correction

```javascript
import useAIAssistant from "../hooks/useAIAssistant";

// Inside a component
const { correctGrammar } = useAIAssistant();

// Usage
const handleCorrect = async () => {
  const text = "me going to store";
  const result = await correctGrammar(text);
  console.log(result.corrected); // "I am going to the store."
  console.log(result.explanation); // "Changed 'me going' to 'I am going' for proper subject pronoun."
};
```

### Symbol Interpretation

```javascript
import useAIAssistant from "../hooks/useAIAssistant";

// Inside a component
const { interpretSymbols } = useAIAssistant();

// Usage
const handleInterpret = async () => {
  const symbols = [
    { id: "sym1", name: "help" },
    { id: "sym2", name: "please" },
    { id: "sym3", name: "now" },
  ];
  const result = await interpretSymbols(symbols);
  console.log(result.text); // "I need help right now, please."
  console.log(result.confidence); // 0.85
};
```

## AI Assistant Component

The `AIAssistant` component provides a complete UI for interacting with the AI Assistant:

```jsx
import AIAssistant from "../components/AIAssistant";

// Usage in a component
const MyComponent = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const handleSentenceGenerated = (sentence) => {
    console.log("Generated:", sentence);
    // Do something with the sentence
  };

  return (
    <div>
      <button onClick={() => setIsAssistantOpen(true)}>Open AI Assistant</button>

      {isAssistantOpen && (
        <AIAssistant
          symbols={["I", "want", "play"]}
          mode="sentence" // 'sentence', 'grammar', or 'interpret'
          onSentenceGenerated={handleSentenceGenerated}
          onClose={() => setIsAssistantOpen(false)}
        />
      )}
    </div>
  );
};
```

## Demo Page

A demonstration page is available at `/ai-assistant` that showcases all features of the AI Assistant integration.

## Authentication and Security

The AI Assistant requires user authentication for personalized features. The OpenAI API key is stored securely in environment variables and never exposed to the client.

## Future Enhancements

Planned enhancements for the AI Assistant integration:

1. **Offline Support**: Provide basic functionality when offline
2. **Additional AI Providers**: Support for alternatives like Anthropic Claude
3. **Voice Input**: Allow voice input for grammar correction
4. **Expanded Symbol Libraries**: Integration with standard AAC symbol libraries
5. **Learning Analytics**: Track AI usage patterns to improve learning outcomes
