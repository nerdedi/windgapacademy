/**
 * AI Service for Curriculum Generation
 * Supports multiple AI providers: OpenAI, Anthropic, and local models
 */

// AI Module Generation Service
export class CurriculumAIService {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    this.provider = config.provider || "openai"; // openai, anthropic, local
    this.model = config.model || "gpt-4";
    this.baseUrl = config.baseUrl;
  }

  /**
   * Generate a complete curriculum module using AI
   */
  async generateModule({
    subject,
    character,
    learningObjectives = [],
    difficulty = "intermediate",
    duration = 30, // minutes
    studentProfile = null,
    accessibilityRequirements = [],
  }) {
    try {
      const prompt = this.buildModulePrompt({
        subject,
        character,
        learningObjectives,
        difficulty,
        duration,
        studentProfile,
        accessibilityRequirements,
      });

      const response = await this.callAI(prompt);
      const parsedModule = this.parseModuleResponse(response);

      // Enhance with character animations
      const enhancedModule = await this.addCharacterAnimations(parsedModule, character);

      return {
        ...enhancedModule,
        metadata: {
          generatedAt: new Date().toISOString(),
          aiProvider: this.provider,
          model: this.model,
          subject,
          character: character.name,
          difficulty,
          estimatedDuration: duration,
        },
      };
    } catch (error) {
      console.error("AI Module Generation Error:", error);
      throw new Error(`Failed to generate module: ${error.message}`);
    }
  }

  /**
   * Generate personalized learning content based on student progress
   */
  async generatePersonalizedContent({
    studentId,
    currentProgress,
    learningStyle,
    strengths,
    challenges,
    character,
  }) {
    const prompt = `
Generate personalized learning content for a student with the following profile:

Student Profile:
- ID: ${studentId}
- Current Progress: ${JSON.stringify(currentProgress, null, 2)}
- Learning Style: ${learningStyle}
- Strengths: ${strengths.join(", ")}
- Challenges: ${challenges.join(", ")}
- Character Guide: ${character.name}

Create adaptive content that:
1. Builds on their strengths
2. Addresses their challenges with supportive scaffolding
3. Matches their learning style
4. Uses ${character.name} as a guide with appropriate animations

Format as JSON with sections: introduction, activities, assessments, character_interactions.
`;

    const response = await this.callAI(prompt);
    return this.parsePersonalizedContent(response);
  }

  /**
   * Generate assessment questions aligned with learning objectives
   */
  async generateAssessment({
    subject,
    learningObjectives,
    difficulty,
    questionTypes = ["multiple-choice", "short-answer", "scenario"],
    accessibility = [],
  }) {
    const prompt = `
Create an assessment for ${subject} with the following requirements:

Learning Objectives:
${learningObjectives.map((obj) => `- ${obj}`).join("\n")}

Requirements:
- Difficulty: ${difficulty}
- Question Types: ${questionTypes.join(", ")}
- Accessibility: ${accessibility.join(", ")}

Generate 8-12 questions that accurately measure the learning objectives.
Include rubrics and adaptive feedback for different performance levels.

Format as JSON with: questions, rubrics, feedback_templates, accessibility_notes.
`;

    const response = await this.callAI(prompt);
    return this.parseAssessmentResponse(response);
  }

  /**
   * Build comprehensive module generation prompt
   */
  buildModulePrompt({
    subject,
    character,
    learningObjectives,
    difficulty,
    duration,
    studentProfile,
    accessibilityRequirements,
  }) {
    return `
You are an expert curriculum designer creating an engaging, interactive learning module.

CONTEXT:
- Subject: ${subject}
- Character Guide: ${character.name} (${character.subjects.join(", ")})
- Difficulty Level: ${difficulty}
- Duration: ${duration} minutes
- Student Profile: ${studentProfile ? JSON.stringify(studentProfile) : "General audience"}

LEARNING OBJECTIVES:
${learningObjectives.length > 0 ? learningObjectives.map((obj) => `- ${obj}`).join("\n") : "- To be determined based on subject area"}

ACCESSIBILITY REQUIREMENTS:
${accessibilityRequirements.length > 0 ? accessibilityRequirements.map((req) => `- ${req}`).join("\n") : "- Standard web accessibility (WCAG 2.1 AA)"}

CHARACTER CONTEXT:
${character.name} is an AI character guide with these available animations:
${character.animations.map((anim) => `- ${anim.label} (${anim.id}): ${anim.clipName}`).join("\n")}

REQUIREMENTS:
1. Create a complete, engaging learning module
2. Include clear learning objectives if not provided
3. Design interactive activities that utilize ${character.name}'s animations
4. Provide multiple learning modalities (visual, auditory, kinesthetic)
5. Include formative and summative assessments
6. Ensure accessibility compliance
7. Create scaffolded learning progression
8. Include reflection and metacognitive elements

OUTPUT FORMAT (JSON):
{
  "title": "Module title",
  "description": "Brief module description",
  "learningObjectives": ["objective 1", "objective 2", ...],
  "prerequisites": ["prerequisite 1", ...],
  "sections": [
    {
      "id": "section_1",
      "title": "Section Title",
      "type": "introduction|lesson|activity|assessment|reflection",
      "duration": 5,
      "content": {
        "text": "Main content text",
        "multimedia": ["image_url", "video_url", ...],
        "interactiveElements": [
          {
            "type": "quiz|discussion|simulation|exercise",
            "title": "Element title",
            "description": "Element description",
            "data": {}
          }
        ]
      },
      "characterInteractions": [
        {
          "trigger": "section_start|user_action|timer",
          "animation": "teaching|encourage|celebrate|idle",
          "dialogue": "What the character says",
          "timing": "when this happens"
        }
      ],
      "accessibilityFeatures": ["alt_text", "screen_reader", "keyboard_nav", ...]
    }
  ],
  "assessments": {
    "formative": [
      {
        "type": "check_understanding|quick_quiz|reflection",
        "questions": [...],
        "feedback": {...}
      }
    ],
    "summative": {
      "type": "final_assessment",
      "questions": [...],
      "rubric": {...}
    }
  },
  "resources": {
    "additional_reading": [...],
    "practice_exercises": [...],
    "external_links": [...]
  },
  "adaptations": {
    "different_learning_styles": {...},
    "accessibility_alternatives": {...},
    "difficulty_variations": {...}
  }
}

Create a comprehensive, engaging module that maximizes learning effectiveness while being inclusive and accessible.
`;
  }

  /**
   * Call AI service based on provider
   */
  async callAI(prompt, options = {}) {
    const { temperature = 0.7, maxTokens = 4000 } = options;

    switch (this.provider) {
      case "openai":
        return this.callOpenAI(prompt, { temperature, maxTokens });
      case "anthropic":
        return this.callAnthropic(prompt, { temperature, maxTokens });
      case "local":
        return this.callLocalAI(prompt, { temperature, maxTokens });
      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  /**
   * OpenAI API integration
   */
  async callOpenAI(prompt, options) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert curriculum designer and educational technologist specializing in creating engaging, accessible learning experiences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: options.temperature,
        max_tokens: options.maxTokens,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  /**
   * Anthropic Claude API integration
   */
  async callAnthropic(prompt, options) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model || "claude-3-sonnet-20240229",
        max_tokens: options.maxTokens,
        temperature: options.temperature,
        messages: [
          {
            role: "user",
            content: `${prompt}\n\nPlease respond with valid JSON only.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  /**
   * Local AI integration (Ollama, etc.)
   */
  async callLocalAI(prompt, options) {
    const baseUrl = this.baseUrl || "http://localhost:11434";

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model || "llama2",
        prompt: `${prompt}\n\nRespond with valid JSON only.`,
        stream: false,
        options: {
          temperature: options.temperature,
          num_predict: options.maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Local AI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  /**
   * Parse and validate AI response
   */
  parseModuleResponse(response) {
    try {
      const parsed = JSON.parse(response);

      // Validate required fields
      if (!parsed.title || !parsed.sections || !Array.isArray(parsed.sections)) {
        throw new Error("Invalid module structure");
      }

      // Ensure all sections have required fields
      parsed.sections.forEach((section, index) => {
        if (!section.id || !section.title || !section.type) {
          throw new Error(`Invalid section structure at index ${index}`);
        }
      });

      return parsed;
    } catch (error) {
      console.error("Failed to parse AI response:", response);
      throw new Error(`Invalid AI response format: ${error.message}`);
    }
  }

  /**
   * Parse personalized content response
   */
  parsePersonalizedContent(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        introduction: parsed.introduction || "",
        activities: parsed.activities || [],
        assessments: parsed.assessments || [],
        characterInteractions: parsed.character_interactions || [],
        adaptations: parsed.adaptations || {},
      };
    } catch (error) {
      throw new Error(`Failed to parse personalized content: ${error.message}`);
    }
  }

  /**
   * Parse assessment response
   */
  parseAssessmentResponse(response) {
    try {
      const parsed = JSON.parse(response);
      return {
        questions: parsed.questions || [],
        rubrics: parsed.rubrics || {},
        feedbackTemplates: parsed.feedback_templates || {},
        accessibilityNotes: parsed.accessibility_notes || [],
      };
    } catch (error) {
      throw new Error(`Failed to parse assessment: ${error.message}`);
    }
  }

  /**
   * Add character animations to module content
   */
  async addCharacterAnimations(module, character) {
    const enhancedSections = module.sections.map((section) => {
      if (!section.characterInteractions) {
        // Add default character interactions based on section type
        section.characterInteractions = this.generateDefaultInteractions(section, character);
      }

      return section;
    });

    return {
      ...module,
      sections: enhancedSections,
    };
  }

  /**
   * Generate default character interactions
   */
  generateDefaultInteractions(section, character) {
    const interactions = [];

    switch (section.type) {
      case "introduction":
        interactions.push({
          trigger: "section_start",
          animation: "teaching",
          dialogue: `Hi! I'm ${character.name}. Let's start learning about ${section.title}!`,
          timing: "immediate",
        });
        break;

      case "lesson":
        interactions.push(
          {
            trigger: "section_start",
            animation: "teaching",
            dialogue: `Now let's dive into ${section.title}. Pay close attention!`,
            timing: "immediate",
          },
          {
            trigger: "section_progress_50",
            animation: "encourage",
            dialogue: `You're doing great! Keep going!`,
            timing: "progress_milestone",
          },
        );
        break;

      case "activity":
        interactions.push({
          trigger: "section_start",
          animation: "encourage",
          dialogue: `Time for a hands-on activity! I believe in you!`,
          timing: "immediate",
        });
        break;

      case "assessment":
        interactions.push(
          {
            trigger: "section_start",
            animation: "teaching",
            dialogue: `Let's see how well you've learned. Take your time!`,
            timing: "immediate",
          },
          {
            trigger: "assessment_complete",
            animation: "celebrate",
            dialogue: `Excellent work! You've completed the assessment!`,
            timing: "completion",
          },
        );
        break;

      default:
        interactions.push({
          trigger: "section_start",
          animation: "idle",
          dialogue: `I'm here to help you with ${section.title}.`,
          timing: "immediate",
        });
    }

    return interactions;
  }
}

// Export default instance
export const curriculumAI = new CurriculumAIService({
  provider: process.env.AI_PROVIDER || "openai",
  model: process.env.AI_MODEL || "gpt-4",
  apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY,
});
