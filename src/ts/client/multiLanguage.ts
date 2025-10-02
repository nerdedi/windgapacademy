import { writable } from 'svelte/store';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  rtl: boolean;
  voiceOptions: VoiceOption[];
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'neutral';
  provider: 'browser' | 'azure' | 'google' | 'amazon';
}

export interface LanguagePack {
  language: Language;
  translations: Record<string, string>;
  commonPhrases: Array<{ text: string; category: string; priority: number }>;
  symbolMappings: Record<string, string>; // symbol ID -> localized symbol
}

class MultiLanguageManager {
  private currentLanguage: string = 'en';
  private loadedPacks: Map<string, LanguagePack> = new Map();
  private fallbackLanguage = 'en';

  private availableLanguages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      rtl: false,
      voiceOptions: [
        { id: 'en-US-female', name: 'Female US', gender: 'female', provider: 'browser' },
        { id: 'en-US-male', name: 'Male US', gender: 'male', provider: 'browser' },
        { id: 'en-GB-female', name: 'Female UK', gender: 'female', provider: 'browser' }
      ]
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      rtl: false,
      voiceOptions: [
        { id: 'es-ES-female', name: 'Female Spain', gender: 'female', provider: 'browser' },
        { id: 'es-MX-female', name: 'Female Mexico', gender: 'female', provider: 'browser' }
      ]
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      rtl: false,
      voiceOptions: [
        { id: 'fr-FR-female', name: 'Female France', gender: 'female', provider: 'browser' },
        { id: 'fr-CA-female', name: 'Female Canada', gender: 'female', provider: 'browser' }
      ]
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      rtl: false,
      voiceOptions: [
        { id: 'de-DE-female', name: 'Female Germany', gender: 'female', provider: 'browser' }
      ]
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      rtl: false,
      voiceOptions: [
        { id: 'zh-CN-female', name: 'Female Mandarin', gender: 'female', provider: 'browser' }
      ]
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      rtl: true,
      voiceOptions: [
        { id: 'ar-SA-female', name: 'Female Saudi', gender: 'female', provider: 'browser' }
      ]
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      rtl: false,
      voiceOptions: [
        { id: 'pt-BR-female', name: 'Female Brazil', gender: 'female', provider: 'browser' }
      ]
    }
  ];

  async initialize(userLanguage?: string) {
    // Detect user's preferred language
    const detectedLanguage = userLanguage ||
      localStorage.getItem('preferred_language') ||
      navigator.language.split('-')[0] ||
      this.fallbackLanguage;

    await this.setLanguage(detectedLanguage);
  }

  async setLanguage(languageCode: string): Promise<boolean> {
    try {
      // Load language pack if not already loaded
      if (!this.loadedPacks.has(languageCode)) {
        await this.loadLanguagePack(languageCode);
      }

      this.currentLanguage = languageCode;
      localStorage.setItem('preferred_language', languageCode);

      // Update document direction for RTL languages
      const language = this.getLanguage(languageCode);
      if (language) {
        document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
      }

      // Update store
      languageStore.set({
        currentLanguage: languageCode,
        availableLanguages: this.availableLanguages,
        isRTL: language?.rtl || false
      });

      return true;
    } catch (error) {
      console.error(`Failed to set language to ${languageCode}:`, error);
      return false;
    }
  }

  private async loadLanguagePack(languageCode: string): Promise<void> {
    try {
      // Try to load from local storage first
      const cached = localStorage.getItem(`language_pack_${languageCode}`);
      if (cached) {
        const pack = JSON.parse(cached);
        this.loadedPacks.set(languageCode, pack);
        return;
      }

      // Load from API
      const response = await fetch(`/api/languages/${languageCode}`);
      if (response.ok) {
        const pack = await response.json();
        this.loadedPacks.set(languageCode, pack);
        localStorage.setItem(`language_pack_${languageCode}`, JSON.stringify(pack));
        return;
      }

      // Load built-in pack
      const pack = await this.loadBuiltInPack(languageCode);
      this.loadedPacks.set(languageCode, pack);

    } catch (error) {
      console.error(`Failed to load language pack for ${languageCode}:`, error);
      throw error;
    }
  }

  private async loadBuiltInPack(languageCode: string): Promise<LanguagePack> {
    const language = this.getLanguage(languageCode);
    if (!language) {
      throw new Error(`Language ${languageCode} not supported`);
    }

    // Built-in translations for core UI elements
    const coreTranslations = await this.getCoreTranslations(languageCode);
    const commonPhrases = await this.getCommonPhrases(languageCode);

    return {
      language,
      translations: coreTranslations,
      commonPhrases,
      symbolMappings: {} // Would be populated with actual symbol mappings
    };
  }

  private async getCoreTranslations(languageCode: string): Promise<Record<string, string>> {
    // In a real implementation, these would be loaded from translation files
    const translations: Record<string, Record<string, string>> = {
      es: {
        'hello': 'hola',
        'goodbye': 'adiós',
        'please': 'por favor',
        'thank_you': 'gracias',
        'yes': 'sí',
        'no': 'no',
        'help': 'ayuda',
        'more': 'más',
        'stop': 'parar',
        'go': 'ir',
        'want': 'quiero',
        'need': 'necesito',
        'like': 'me gusta',
        'love': 'amo',
        'eat': 'comer',
        'drink': 'beber',
        'play': 'jugar',
        'home': 'casa',
        'school': 'escuela',
        'family': 'familia',
        'emergency': 'emergencia'
      },
      fr: {
        'hello': 'bonjour',
        'goodbye': 'au revoir',
        'please': 's\'il vous plaît',
        'thank_you': 'merci',
        'yes': 'oui',
        'no': 'non',
        'help': 'aide',
        'more': 'plus',
        'stop': 'arrêter',
        'go': 'aller',
        'want': 'veux',
        'need': 'besoin',
        'like': 'aime',
        'love': 'amour',
        'eat': 'manger',
        'drink': 'boire',
        'play': 'jouer',
        'home': 'maison',
        'school': 'école',
        'family': 'famille',
        'emergency': 'urgence'
      },
      de: {
        'hello': 'hallo',
        'goodbye': 'auf wiedersehen',
        'please': 'bitte',
        'thank_you': 'danke',
        'yes': 'ja',
        'no': 'nein',
        'help': 'hilfe',
        'more': 'mehr',
        'stop': 'stoppen',
        'go': 'gehen',
        'want': 'will',
        'need': 'brauche',
        'like': 'mögen',
        'love': 'liebe',
        'eat': 'essen',
        'drink': 'trinken',
        'play': 'spielen',
        'home': 'zuhause',
        'school': 'schule',
        'family': 'familie',
        'emergency': 'notfall'
      }
    };

    return translations[languageCode] || {};
  }

  private async getCommonPhrases(languageCode: string): Promise<Array<{ text: string; category: string; priority: number }>> {
    const phrasesByLanguage: Record<string, Array<{ text: string; category: string; priority: number }>> = {
      es: [
        { text: 'Hola', category: 'greetings', priority: 10 },
        { text: 'Adiós', category: 'greetings', priority: 9 },
        { text: 'Por favor', category: 'politeness', priority: 8 },
        { text: 'Gracias', category: 'politeness', priority: 8 },
        { text: 'Lo siento', category: 'politeness', priority: 7 },
        { text: 'Te amo', category: 'emotions', priority: 9 },
        { text: 'Necesito ayuda', category: 'needs', priority: 10 },
        { text: 'Tengo hambre', category: 'needs', priority: 8 },
        { text: 'Tengo sed', category: 'needs', priority: 8 },
        { text: '¿Cómo estás?', category: 'questions', priority: 7 }
      ],
      fr: [
        { text: 'Bonjour', category: 'greetings', priority: 10 },
        { text: 'Au revoir', category: 'greetings', priority: 9 },
        { text: 'S\'il vous plaît', category: 'politeness', priority: 8 },
        { text: 'Merci', category: 'politeness', priority: 8 },
        { text: 'Je suis désolé', category: 'politeness', priority: 7 },
        { text: 'Je t\'aime', category: 'emotions', priority: 9 },
        { text: 'J\'ai besoin d\'aide', category: 'needs', priority: 10 },
        { text: 'J\'ai faim', category: 'needs', priority: 8 },
        { text: 'J\'ai soif', category: 'needs', priority: 8 },
        { text: 'Comment allez-vous?', category: 'questions', priority: 7 }
      ],
      de: [
        { text: 'Hallo', category: 'greetings', priority: 10 },
        { text: 'Auf Wiedersehen', category: 'greetings', priority: 9 },
        { text: 'Bitte', category: 'politeness', priority: 8 },
        { text: 'Danke', category: 'politeness', priority: 8 },
        { text: 'Es tut mir leid', category: 'politeness', priority: 7 },
        { text: 'Ich liebe dich', category: 'emotions', priority: 9 },
        { text: 'Ich brauche Hilfe', category: 'needs', priority: 10 },
        { text: 'Ich habe Hunger', category: 'needs', priority: 8 },
        { text: 'Ich habe Durst', category: 'needs', priority: 8 },
        { text: 'Wie geht es dir?', category: 'questions', priority: 7 }
      ]
    };

    return phrasesByLanguage[languageCode] || [];
  }

  translate(key: string, fallback?: string): string {
    const pack = this.loadedPacks.get(this.currentLanguage);
    if (pack && pack.translations[key]) {
      return pack.translations[key];
    }

    // Try fallback language
    if (this.currentLanguage !== this.fallbackLanguage) {
      const fallbackPack = this.loadedPacks.get(this.fallbackLanguage);
      if (fallbackPack && fallbackPack.translations[key]) {
        return fallbackPack.translations[key];
      }
    }

    return fallback || key;
  }

  getCommonPhrasesForCategory(category: string): Array<{ text: string; priority: number }> {
    const pack = this.loadedPacks.get(this.currentLanguage);
    if (!pack) return [];

    return pack.commonPhrases
      .filter(phrase => phrase.category === category)
      .sort((a, b) => b.priority - a.priority);
  }

  getAllCommonPhrases(): Array<{ text: string; category: string; priority: number }> {
    const pack = this.loadedPacks.get(this.currentLanguage);
    if (!pack) return [];

    return pack.commonPhrases.sort((a, b) => b.priority - a.priority);
  }

  getLanguage(code: string): Language | undefined {
    return this.availableLanguages.find(lang => lang.code === code);
  }

  getCurrentLanguage(): Language | undefined {
    return this.getLanguage(this.currentLanguage);
  }

  getAvailableLanguages(): Language[] {
    return this.availableLanguages;
  }

  async speakInLanguage(text: string, voiceId?: string): Promise<void> {
    const language = this.getCurrentLanguage();
    if (!language) return;

    // Use specified voice or first available voice for current language
    const voice = voiceId ?
      language.voiceOptions.find(v => v.id === voiceId) :
      language.voiceOptions[0];

    if (!voice) {
      console.warn(`No voice available for language ${language.code}`);
      return;
    }

    try {
      // Use Web Speech API if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language.code;

        // Try to find matching browser voice
        const voices = speechSynthesis.getVoices();
        const matchingVoice = voices.find(v =>
          v.lang.startsWith(language.code) &&
          (voice.gender === 'female' ? v.name.toLowerCase().includes('female') : true)
        );

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Failed to speak text:', error);
    }
  }

  exportTranslations(): string {
    const data = {
      currentLanguage: this.currentLanguage,
      loadedPacks: Array.from(this.loadedPacks.entries()).map(([code, pack]) => ({
        code,
        pack
      }))
    };

    return JSON.stringify(data, null, 2);
  }

  async importTranslations(data: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(data);

      parsed.loadedPacks.forEach(({ code, pack }: any) => {
        this.loadedPacks.set(code, pack);
        localStorage.setItem(`language_pack_${code}`, JSON.stringify(pack));
      });

      return true;
    } catch (error) {
      console.error('Failed to import translations:', error);
      return false;
    }
  }
}

// Language store
interface LanguageState {
  currentLanguage: string;
  availableLanguages: Language[];
  isRTL: boolean;
}

export const languageStore = writable<LanguageState>({
  currentLanguage: 'en',
  availableLanguages: [],
  isRTL: false
});

// Create singleton instance
export const multiLanguageManager = new MultiLanguageManager();
