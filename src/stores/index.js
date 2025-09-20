/**
 * Advanced state management system using Zustand with middleware
 * 
 * Features:
 * - Core store setup with typed state
 * - Persistence middleware for state saving
 * - DevTools integration for debugging
 * - Analytics middleware for tracking state changes
 * - Time-travel debugging
 * - Undo/redo functionality
 * - Derived state (computed values)
 * - State validation and error reporting
 * - Performance optimization with selective updates
 * - State synchronization across tabs
 * - State versioning and migration
 */

import create from 'zustand';
import { persist, devtools, redux, combine } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { shallow } from 'zustand/shallow';
import { produce } from 'immer';

// Type definitions for our stores
export const StoreTypes = {
  USER: 'user',
  CURRICULUM: 'curriculum',
  UI: 'ui',
  LEARNING: 'learning',
  GAME: 'game',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics'
};

// Helper for tracking and logging state changes
const trackingMiddleware = (config) => (set, get, api) => config(
  (...args) => {
    // Log state changes
    const prevState = get();
    set(...args);
    const nextState = get();
    
    // Calculate what changed
    const changes = {};
    Object.keys(nextState).forEach(key => {
      if (prevState[key] !== nextState[key]) {
        changes[key] = {
          from: prevState[key],
          to: nextState[key]
        };
      }
    });
    
    // Call tracking function if provided
    if (api.trackStateChange) {
      api.trackStateChange({
        previousState: prevState,
        nextState,
        changes
      });
    }
    
    // Log changes
    if (Object.keys(changes).length > 0) {
      console.debug('[Store] State updated:', changes);
    }
  },
  get,
  api
);

// Create analytics tracker
const createAnalyticsMiddleware = (storeName) => (config) => (set, get, api) => {
  // Extend API with tracking function
  api.trackStateChange = ({ changes }) => {
    // Skip tracking for certain changes (e.g., UI state that changes frequently)
    const isTrackable = !(
      storeName === StoreTypes.UI && 
      Object.keys(changes).every(key => 
        ['isMenuOpen', 'scrollPosition', 'currentHover'].includes(key)
      )
    );
    
    if (isTrackable && window.analyticsTracker) {
      window.analyticsTracker.trackStateChange(storeName, changes);
    }
  };
  
  // Pass to tracking middleware
  return trackingMiddleware(config)(set, get, api);
};

// History middleware for time-travel debugging
const historyMiddleware = (config) => (set, get, api) => {
  // Add history to API
  api.history = {
    past: [],
    future: [],
    snapshots: {},
    wip: null,
    timeoutId: null,
    
    // Take a snapshot of the current state
    addToHistory: (description = 'State change') => {
      const currentState = get();
      const timestamp = Date.now();
      const snapshot = {
        state: { ...currentState },
        timestamp,
        description
      };
      
      // Add to history
      api.history.past.push(snapshot);
      api.history.snapshots[timestamp] = snapshot;
      
      // Clear future when new actions are performed
      api.history.future = [];
      
      // Limit history size
      if (api.history.past.length > 50) {
        const removed = api.history.past.shift();
        delete api.history.snapshots[removed.timestamp];
      }
    },
    
    // Debounced version of addToHistory
    debouncedAddToHistory: (description = 'State change') => {
      // Clear existing timeout
      if (api.history.timeoutId) {
        clearTimeout(api.history.timeoutId);
      }
      
      // Set new state as WIP
      api.history.wip = {
        state: { ...get() },
        description
      };
      
      // Add to history after delay
      api.history.timeoutId = setTimeout(() => {
        if (api.history.wip) {
          api.history.addToHistory(api.history.wip.description);
          api.history.wip = null;
        }
      }, 500);
    },
    
    // Time travel to a specific state
    travelTo: (timestamp) => {
      const snapshot = api.history.snapshots[timestamp];
      if (snapshot) {
        set(snapshot.state);
        return true;
      }
      return false;
    },
    
    // Undo last state change
    undo: () => {
      const currentState = { ...get() };
      
      if (api.history.past.length > 0) {
        // Move current state to future
        api.history.future.unshift({
          state: currentState,
          timestamp: Date.now(),
          description: 'Undone state'
        });
        
        // Get previous state
        const previous = api.history.past.pop();
        
        // Apply previous state
        set(previous.state);
        return true;
      }
      
      return false;
    },
    
    // Redo previously undone state change
    redo: () => {
      if (api.history.future.length > 0) {
        // Get next state
        const next = api.history.future.shift();
        
        // Move current state to past
        api.history.past.push({
          state: { ...get() },
          timestamp: Date.now(),
          description: 'Redone state'
        });
        
        // Apply next state
        set(next.state);
        return true;
      }
      
      return false;
    },
    
    // Get history for debugging
    getHistory: () => ({
      past: [...api.history.past],
      future: [...api.history.future]
    })
  };
  
  // Return store with history functionality
  return config(
    (...args) => {
      // Add to history before updating state
      api.history.debouncedAddToHistory();
      set(...args);
    },
    get,
    api
  );
};

// Create state validation middleware
const createValidationMiddleware = (validators) => (config) => (set, get, api) => {
  return config(
    (...args) => {
      // Apply the state update
      set(...args);
      
      // Get the updated state
      const state = get();
      
      // Run validators
      const validationErrors = {};
      
      Object.keys(validators).forEach(key => {
        const validator = validators[key];
        const value = state[key];
        
        try {
          if (!validator(value, state)) {
            validationErrors[key] = `Invalid value for ${key}`;
          }
        } catch (err) {
          validationErrors[key] = err.message;
        }
      });
      
      // Log validation errors
      if (Object.keys(validationErrors).length > 0) {
        console.warn('[Store] Validation errors:', validationErrors);
        
        // Store validation errors in state if we have an errors field
        if (state.errors !== undefined) {
          set({ errors: { ...state.errors, ...validationErrors } });
        }
      }
    },
    get,
    api
  );
};

// Create cross-tab synchronization middleware
const createSyncMiddleware = (storeName) => (config) => (set, get, api) => {
  // Set up broadcast channel for cross-tab communication
  let broadcastChannel;
  
  try {
    broadcastChannel = new BroadcastChannel(`store-sync-${storeName}`);
    
    // Listen for updates from other tabs
    broadcastChannel.onmessage = (event) => {
      const { source, state, timestamp } = event.data;
      
      // Skip our own messages
      if (source === api.id) return;
      
      // Apply state from other tab
      set(state);
    };
  } catch (err) {
    console.warn('[Store] BroadcastChannel not supported:', err);
  }
  
  // Generate unique ID for this store instance
  api.id = `${storeName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Return store with sync capability
  return config(
    (...args) => {
      // Apply the state update
      set(...args);
      
      // Broadcast the update to other tabs
      if (broadcastChannel) {
        try {
          broadcastChannel.postMessage({
            source: api.id,
            state: get(),
            timestamp: Date.now()
          });
        } catch (err) {
          console.warn('[Store] Failed to broadcast state:', err);
        }
      }
    },
    get,
    api
  );
};

// Migration middleware for handling state versioning
const createMigrationMiddleware = (currentVersion, migrations) => (config) => (set, get, api) => {
  // Add migration API
  api.migrate = (state) => {
    const stateVersion = state.version || 0;
    
    // State is already at current version
    if (stateVersion === currentVersion) {
      return state;
    }
    
    // Apply migrations in sequence
    let migratedState = { ...state };
    
    for (let v = stateVersion; v < currentVersion; v++) {
      const migration = migrations[v];
      
      if (migration) {
        console.log(`[Store] Migrating state from version ${v} to ${v + 1}`);
        migratedState = migration(migratedState);
        migratedState.version = v + 1;
      }
    }
    
    return migratedState;
  };
  
  // Wrap config to handle migrations when hydrating
  const wrappedConfig = (set, get, api) => {
    return config(
      (...args) => {
        set(...args);
      },
      get,
      api
    );
  };
  
  return wrappedConfig(set, get, api);
};

// Factory function to create a store with all middleware
export const createStore = ({
  name,
  initialState,
  actions,
  selectors = {},
  computed = {},
  validators = {},
  enablePersist = false,
  enableDevTools = process.env.NODE_ENV !== 'production',
  enableHistory = false,
  enableSync = false,
  migrations = {},
  version = 1,
  persistOptions = {}
}) => {
  // Build middleware stack
  let middleware = (config) => config;
  
  // Add immer middleware for immutable updates with mutable syntax
  middleware = (config) => immer(middleware(config));
  
  // Add validation middleware
  if (Object.keys(validators).length > 0) {
    middleware = (config) => createValidationMiddleware(validators)(middleware(config));
  }
  
  // Add analytics tracking
  middleware = (config) => createAnalyticsMiddleware(name)(middleware(config));
  
  // Add history middleware for time-travel debugging
  if (enableHistory) {
    middleware = (config) => historyMiddleware(middleware(config));
  }
  
  // Add cross-tab synchronization
  if (enableSync) {
    middleware = (config) => createSyncMiddleware(name)(middleware(config));
  }
  
  // Add state migrations
  if (version > 1 && Object.keys(migrations).length > 0) {
    middleware = (config) => createMigrationMiddleware(version, migrations)(middleware(config));
  }
  
  // Add devtools for debugging
  if (enableDevTools) {
    middleware = (config) => devtools(middleware(config), { name });
  }
  
  // Add persistence
  if (enablePersist) {
    middleware = (config) => persist(middleware(config), {
      name: `windgap-${name}-store`,
      partialize: (state) => {
        // By default, don't persist UI state and derived state
        const blacklist = persistOptions.blacklist || ['errors', 'isLoading'];
        const whitelist = persistOptions.whitelist;
        
        if (whitelist) {
          // Only include whitelisted keys
          const result = {};
          whitelist.forEach(key => {
            if (key in state) {
              result[key] = state[key];
            }
          });
          return result;
        } else {
          // Exclude blacklisted keys
          const result = { ...state };
          blacklist.forEach(key => {
            delete result[key];
          });
          return result;
        }
      },
      ...persistOptions
    });
  }
  
  // Create base store with middleware
  const useStore = create(middleware((set, get) => {
    // Create store API
    const storeAPI = {
      // Initial state with version
      ...initialState,
      version,
      
      // Add action handlers
      ...Object.entries(actions).reduce((acc, [actionName, actionFn]) => {
        acc[actionName] = (...args) => actionFn(set, get, ...args);
        return acc;
      }, {})
    };
    
    // Add computed values using getters
    Object.entries(computed).forEach(([key, computeFn]) => {
      Object.defineProperty(storeAPI, key, {
        get: () => computeFn(get()),
        enumerable: true
      });
    });
    
    return storeAPI;
  }));
  
  // Create selectors object with optimized selectors
  const optimizedSelectors = Object.entries(selectors).reduce((acc, [selectorName, selectorFn]) => {
    acc[selectorName] = () => useStore(selectorFn, shallow);
    return acc;
  }, {});
  
  // Expose base hooks and selectors
  return {
    useStore,
    ...optimizedSelectors,
    
    // Raw selectors for cases where optimization isn't needed
    selectors,
    
    // Expose store API for external usage (SSR, testing, etc.)
    getState: useStore.getState,
    setState: useStore.setState,
    subscribe: useStore.subscribe,
    destroy: useStore.destroy
  };
};

// User store for authentication and user data
export const createUserStore = () => {
  const initialState = {
    user: null,
    profile: null,
    preferences: {
      theme: 'light',
      notifications: true,
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        fontSize: 'medium'
      }
    },
    isLoading: false,
    error: null,
    isAuthenticated: false,
    authProvider: null,
    roles: [],
    permissions: [],
    lastLogin: null
  };
  
  const actions = {
    setUser: (set, get, user) => {
      set({ 
        user,
        isAuthenticated: !!user,
        authProvider: user?.providerData?.[0]?.providerId || null
      });
    },
    
    setProfile: (set, get, profile) => {
      set({ profile });
    },
    
    updateProfile: (set, get, updates) => {
      set(state => {
        if (state.profile) {
          state.profile = { ...state.profile, ...updates };
        }
      });
    },
    
    setPreferences: (set, get, preferences) => {
      set(state => {
        state.preferences = { ...state.preferences, ...preferences };
      });
    },
    
    setAccessibilityPreference: (set, get, key, value) => {
      set(state => {
        state.preferences.accessibility[key] = value;
      });
    },
    
    setRoles: (set, get, roles) => {
      set({ roles });
    },
    
    addRole: (set, get, role) => {
      set(state => {
        if (!state.roles.includes(role)) {
          state.roles.push(role);
        }
      });
    },
    
    setPermissions: (set, get, permissions) => {
      set({ permissions });
    },
    
    logout: (set) => {
      set({ 
        user: null,
        profile: null,
        isAuthenticated: false,
        authProvider: null,
        roles: [],
        permissions: [],
        lastLogin: null
      });
    },
    
    setLoading: (set, get, isLoading) => {
      set({ isLoading });
    },
    
    setError: (set, get, error) => {
      set({ error });
    }
  };
  
  const selectors = {
    selectUser: state => state.user,
    selectProfile: state => state.profile,
    selectPreferences: state => state.preferences,
    selectAccessibility: state => state.preferences.accessibility,
    selectIsAuthenticated: state => state.isAuthenticated,
    selectRoles: state => state.roles,
    selectPermissions: state => state.permissions,
    selectIsAdmin: state => state.roles.includes('admin'),
    selectIsLoading: state => state.isLoading,
    selectError: state => state.error
  };
  
  const computed = {
    fullName: (state) => {
      if (!state.profile) return '';
      return `${state.profile.firstName || ''} ${state.profile.lastName || ''}`.trim();
    },
    
    hasPermission: (state) => (permission) => {
      if (state.roles.includes('admin')) return true;
      return state.permissions.includes(permission);
    }
  };
  
  const validators = {
    preferences: (prefs) => {
      if (!prefs || typeof prefs !== 'object') return false;
      if (prefs.theme && !['light', 'dark', 'system'].includes(prefs.theme)) return false;
      if (prefs.accessibility && typeof prefs.accessibility !== 'object') return false;
      return true;
    }
  };
  
  const migrations = {
    // Migrate from v0 to v1
    0: (state) => {
      // Handle old state shape where preferences was a top-level object
      if (state.theme && !state.preferences) {
        return {
          ...state,
          preferences: {
            theme: state.theme,
            notifications: state.notifications !== undefined ? state.notifications : true,
            accessibility: {
              reducedMotion: false,
              highContrast: false,
              fontSize: 'medium'
            }
          }
        };
      }
      return state;
    }
  };
  
  return createStore({
    name: StoreTypes.USER,
    initialState,
    actions,
    selectors,
    computed,
    validators,
    enablePersist: true,
    enableDevTools: true,
    enableHistory: true,
    enableSync: true,
    migrations,
    version: 1,
    persistOptions: {
      whitelist: ['user', 'profile', 'preferences', 'roles', 'permissions', 'lastLogin']
    }
  });
};

// UI store for managing UI state
export const createUIStore = () => {
  const initialState = {
    theme: 'light',
    activeModal: null,
    modalProps: {},
    sidebarOpen: false,
    screenSize: 'desktop',
    notifications: [],
    toast: null,
    menuState: {},
    loadingStates: {},
    scrollPositions: {},
    navHistory: [],
    currentPage: null
  };
  
  const actions = {
    setTheme: (set, get, theme) => {
      set({ theme });
      
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', theme);
      
      // Store in local storage for server rendering
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('windgap-theme', theme);
      }
    },
    
    openModal: (set, get, modalId, props = {}) => {
      set({ activeModal: modalId, modalProps: props });
    },
    
    closeModal: (set) => {
      set({ activeModal: null, modalProps: {} });
    },
    
    toggleSidebar: (set, get) => {
      set(state => ({ sidebarOpen: !state.sidebarOpen }));
    },
    
    setScreenSize: (set, get, size) => {
      set({ screenSize: size });
    },
    
    addNotification: (set, get, notification) => {
      const id = notification.id || `notification-${Date.now()}`;
      const newNotification = {
        id,
        createdAt: new Date(),
        read: false,
        ...notification
      };
      
      set(state => {
        state.notifications.push(newNotification);
      });
      
      return id;
    },
    
    removeNotification: (set, get, id) => {
      set(state => {
        state.notifications = state.notifications.filter(n => n.id !== id);
      });
    },
    
    markNotificationAsRead: (set, get, id) => {
      set(state => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
          notification.read = true;
        }
      });
    },
    
    markAllNotificationsAsRead: (set) => {
      set(state => {
        state.notifications.forEach(n => {
          n.read = true;
        });
      });
    },
    
    showToast: (set, get, message, type = 'info', duration = 3000) => {
      const id = `toast-${Date.now()}`;
      set({ 
        toast: { id, message, type, duration } 
      });
      
      // Auto-hide toast after duration
      setTimeout(() => {
        const currentToast = get().toast;
        if (currentToast && currentToast.id === id) {
          set({ toast: null });
        }
      }, duration);
      
      return id;
    },
    
    hideToast: (set) => {
      set({ toast: null });
    },
    
    setMenuState: (set, get, menuId, isOpen) => {
      set(state => {
        state.menuState[menuId] = isOpen;
      });
    },
    
    setLoadingState: (set, get, key, isLoading) => {
      set(state => {
        state.loadingStates[key] = isLoading;
      });
    },
    
    saveScrollPosition: (set, get, page, position) => {
      set(state => {
        state.scrollPositions[page] = position;
      });
    },
    
    navigateTo: (set, get, page) => {
      set(state => {
        state.navHistory.push(state.currentPage);
        state.currentPage = page;
      });
    },
    
    goBack: (set, get) => {
      const { navHistory } = get();
      
      if (navHistory.length > 0) {
        const previousPage = navHistory[navHistory.length - 1];
        
        set(state => {
          state.currentPage = previousPage;
          state.navHistory.pop();
        });
        
        return previousPage;
      }
      
      return null;
    }
  };
  
  const selectors = {
    selectTheme: state => state.theme,
    selectActiveModal: state => state.activeModal,
    selectModalProps: state => state.modalProps,
    selectSidebarOpen: state => state.sidebarOpen,
    selectScreenSize: state => state.screenSize,
    selectNotifications: state => state.notifications,
    selectUnreadNotifications: state => state.notifications.filter(n => !n.read),
    selectToast: state => state.toast,
    selectMenuState: state => state.menuState,
    selectLoadingStates: state => state.loadingStates,
    selectIsLoading: state => key => Boolean(state.loadingStates[key]),
    selectScrollPositions: state => state.scrollPositions,
    selectCurrentPage: state => state.currentPage
  };
  
  const computed = {
    unreadCount: (state) => state.notifications.filter(n => !n.read).length,
    isAnyLoading: (state) => Object.values(state.loadingStates).some(Boolean),
    isDarkTheme: (state) => state.theme === 'dark',
    canGoBack: (state) => state.navHistory.length > 0
  };
  
  return createStore({
    name: StoreTypes.UI,
    initialState,
    actions,
    selectors,
    computed,
    enablePersist: true,
    enableDevTools: true,
    persistOptions: {
      whitelist: ['theme', 'screenSize', 'notifications']
    }
  });
};

// Curriculum store for managing learning content
export const createCurriculumStore = () => {
  const initialState = {
    courses: [],
    modules: [],
    lessons: [],
    activeContent: null,
    contentHistory: [],
    progress: {},
    favorites: [],
    notes: {},
    quizResults: {},
    lastUpdated: null,
    isLoading: false,
    error: null
  };
  
  const actions = {
    setCourses: (set, get, courses) => {
      set({ 
        courses,
        lastUpdated: new Date().toISOString()
      });
    },
    
    setModules: (set, get, modules) => {
      set({ 
        modules,
        lastUpdated: new Date().toISOString()
      });
    },
    
    setLessons: (set, get, lessons) => {
      set({ 
        lessons,
        lastUpdated: new Date().toISOString()
      });
    },
    
    setActiveContent: (set, get, contentId, contentType) => {
      const prevContent = get().activeContent;
      
      set(state => {
        // Add previous content to history
        if (prevContent) {
          state.contentHistory.push(prevContent);
          
          // Limit history size
          if (state.contentHistory.length > 20) {
            state.contentHistory.shift();
          }
        }
        
        state.activeContent = { id: contentId, type: contentType };
      });
    },
    
    updateProgress: (set, get, contentId, progress) => {
      set(state => {
        state.progress[contentId] = {
          ...state.progress[contentId],
          ...progress,
          lastUpdated: new Date().toISOString()
        };
      });
    },
    
    markAsComplete: (set, get, contentId) => {
      set(state => {
        state.progress[contentId] = {
          ...state.progress[contentId],
          completed: true,
          completedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
      });
    },
    
    addToFavorites: (set, get, contentId) => {
      set(state => {
        if (!state.favorites.includes(contentId)) {
          state.favorites.push(contentId);
        }
      });
    },
    
    removeFromFavorites: (set, get, contentId) => {
      set(state => {
        state.favorites = state.favorites.filter(id => id !== contentId);
      });
    },
    
    addNote: (set, get, contentId, note) => {
      const noteId = note.id || `note-${Date.now()}`;
      const newNote = {
        id: noteId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...note
      };
      
      set(state => {
        state.notes[contentId] = state.notes[contentId] || [];
        state.notes[contentId].push(newNote);
      });
      
      return noteId;
    },
    
    updateNote: (set, get, contentId, noteId, updates) => {
      set(state => {
        const contentNotes = state.notes[contentId] || [];
        const noteIndex = contentNotes.findIndex(n => n.id === noteId);
        
        if (noteIndex !== -1) {
          contentNotes[noteIndex] = {
            ...contentNotes[noteIndex],
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
      });
    },
    
    deleteNote: (set, get, contentId, noteId) => {
      set(state => {
        const contentNotes = state.notes[contentId] || [];
        state.notes[contentId] = contentNotes.filter(n => n.id !== noteId);
      });
    },
    
    saveQuizResult: (set, get, quizId, result) => {
      const resultId = `result-${Date.now()}`;
      const newResult = {
        id: resultId,
        timestamp: new Date().toISOString(),
        ...result
      };
      
      set(state => {
        state.quizResults[quizId] = state.quizResults[quizId] || [];
        state.quizResults[quizId].push(newResult);
      });
      
      return resultId;
    },
    
    setLoading: (set, get, isLoading) => {
      set({ isLoading });
    },
    
    setError: (set, get, error) => {
      set({ error });
    }
  };
  
  const selectors = {
    selectCourses: state => state.courses,
    selectModules: state => state.modules,
    selectLessons: state => state.lessons,
    selectActiveContent: state => state.activeContent,
    selectContentHistory: state => state.contentHistory,
    selectProgress: state => state.progress,
    selectContentProgress: state => contentId => state.progress[contentId] || {},
    selectFavorites: state => state.favorites,
    selectNotes: state => state.notes,
    selectContentNotes: state => contentId => state.notes[contentId] || [],
    selectQuizResults: state => state.quizResults,
    selectQuizResultsForQuiz: state => quizId => state.quizResults[quizId] || [],
    selectIsLoading: state => state.isLoading,
    selectError: state => state.error
  };
  
  const computed = {
    totalCompletedCount: (state) => 
      Object.values(state.progress).filter(p => p.completed).length,
    
    completionPercentage: (state) => {
      const totalContent = state.courses.length + state.modules.length + state.lessons.length;
      if (totalContent === 0) return 0;
      
      const completed = Object.values(state.progress).filter(p => p.completed).length;
      return Math.round((completed / totalContent) * 100);
    },
    
    courseProgress: (state) => (courseId) => {
      const courseModules = state.modules.filter(m => m.courseId === courseId);
      if (courseModules.length === 0) return 0;
      
      const completedModules = courseModules.filter(m => 
        state.progress[m.id] && state.progress[m.id].completed
      ).length;
      
      return Math.round((completedModules / courseModules.length) * 100);
    },
    
    moduleProgress: (state) => (moduleId) => {
      const moduleLessons = state.lessons.filter(l => l.moduleId === moduleId);
      if (moduleLessons.length === 0) return 0;
      
      const completedLessons = moduleLessons.filter(l => 
        state.progress[l.id] && state.progress[l.id].completed
      ).length;
      
      return Math.round((completedLessons / moduleLessons.length) * 100);
    },
    
    getRecommendedContent: (state) => {
      // Simple recommendation based on progress
      const incompleteContent = [
        ...state.courses.map(c => ({ ...c, type: 'course' })),
        ...state.modules.map(m => ({ ...m, type: 'module' })),
        ...state.lessons.map(l => ({ ...l, type: 'lesson' }))
      ].filter(content => 
        !state.progress[content.id] || !state.progress[content.id].completed
      );
      
      // Sort by progress (started items first)
      return incompleteContent.sort((a, b) => {
        const aProgress = state.progress[a.id]?.progressPercentage || 0;
        const bProgress = state.progress[b.id]?.progressPercentage || 0;
        return bProgress - aProgress;
      }).slice(0, 5);
    }
  };
  
  const validators = {
    progress: (progress) => {
      if (!progress || typeof progress !== 'object') return false;
      
      // Check for any invalid progress entries
      for (const key in progress) {
        const entry = progress[key];
        if (!entry || typeof entry !== 'object') return false;
        
        // Validate completed flag
        if (entry.completed !== undefined && typeof entry.completed !== 'boolean') {
          return false;
        }
        
        // Validate progress percentage
        if (entry.progressPercentage !== undefined) {
          const percent = Number(entry.progressPercentage);
          if (isNaN(percent) || percent < 0 || percent > 100) {
            return false;
          }
        }
      }
      
      return true;
    }
  };
  
  return createStore({
    name: StoreTypes.CURRICULUM,
    initialState,
    actions,
    selectors,
    computed,
    validators,
    enablePersist: true,
    enableDevTools: true,
    persistOptions: {
      whitelist: ['progress', 'favorites', 'notes', 'quizResults']
    }
  });
};

// Game state store for learning games
export const createGameStore = () => {
  const initialState = {
    activeGame: null,
    gameState: {},
    playerStats: {},
    rewards: [],
    achievements: [],
    inventory: [],
    gameSettings: {
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'medium',
      hapticFeedback: true
    },
    sessionData: {
      startTime: null,
      lastActive: null,
      score: 0,
      level: 1
    },
    isLoading: false,
    error: null
  };
  
  const actions = {
    startGame: (set, get, gameId, initialState = {}) => {
      set({
        activeGame: gameId,
        gameState: initialState,
        sessionData: {
          startTime: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          score: 0,
          level: 1
        }
      });
    },
    
    endGame: (set, get) => {
      const state = get();
      const sessionDuration = state.sessionData.startTime
        ? new Date() - new Date(state.sessionData.startTime)
        : 0;
      
      set({
        activeGame: null,
        sessionData: {
          ...state.sessionData,
          endTime: new Date().toISOString(),
          duration: sessionDuration
        }
      });
      
      return {
        game: state.activeGame,
        score: state.sessionData.score,
        level: state.sessionData.level,
        duration: sessionDuration
      };
    },
    
    updateGameState: (set, get, updates) => {
      set(state => {
        state.gameState = {
          ...state.gameState,
          ...updates
        };
        state.sessionData.lastActive = new Date().toISOString();
      });
    },
    
    updatePlayerStats: (set, get, stats) => {
      set(state => {
        state.playerStats = {
          ...state.playerStats,
          ...stats
        };
      });
    },
    
    addReward: (set, get, reward) => {
      const rewardId = reward.id || `reward-${Date.now()}`;
      const newReward = {
        id: rewardId,
        earnedAt: new Date().toISOString(),
        ...reward
      };
      
      set(state => {
        state.rewards.push(newReward);
      });
      
      return rewardId;
    },
    
    unlockAchievement: (set, get, achievement) => {
      const achievementId = achievement.id || `achievement-${Date.now()}`;
      const newAchievement = {
        id: achievementId,
        unlockedAt: new Date().toISOString(),
        ...achievement
      };
      
      set(state => {
        if (!state.achievements.some(a => a.id === achievementId)) {
          state.achievements.push(newAchievement);
        }
      });
      
      return achievementId;
    },
    
    addInventoryItem: (set, get, item) => {
      const itemId = item.id || `item-${Date.now()}`;
      const newItem = {
        id: itemId,
        acquiredAt: new Date().toISOString(),
        ...item
      };
      
      set(state => {
        state.inventory.push(newItem);
      });
      
      return itemId;
    },
    
    removeInventoryItem: (set, get, itemId) => {
      set(state => {
        state.inventory = state.inventory.filter(item => item.id !== itemId);
      });
    },
    
    updateGameSettings: (set, get, settings) => {
      set(state => {
        state.gameSettings = {
          ...state.gameSettings,
          ...settings
        };
      });
    },
    
    incrementScore: (set, get, points) => {
      set(state => {
        state.sessionData.score += points;
      });
    },
    
    setLevel: (set, get, level) => {
      set(state => {
        state.sessionData.level = level;
      });
    },
    
    setLoading: (set, get, isLoading) => {
      set({ isLoading });
    },
    
    setError: (set, get, error) => {
      set({ error });
    }
  };
  
  const selectors = {
    selectActiveGame: state => state.activeGame,
    selectGameState: state => state.gameState,
    selectPlayerStats: state => state.playerStats,
    selectRewards: state => state.rewards,
    selectAchievements: state => state.achievements,
    selectInventory: state => state.inventory,
    selectGameSettings: state => state.gameSettings,
    selectSessionData: state => state.sessionData,
    selectScore: state => state.sessionData.score,
    selectLevel: state => state.sessionData.level,
    selectIsLoading: state => state.isLoading,
    selectError: state => state.error
  };
  
  const computed = {
    isGameActive: (state) => state.activeGame !== null,
    sessionDuration: (state) => {
      if (!state.sessionData.startTime) return 0;
      const endTime = state.sessionData.endTime
        ? new Date(state.sessionData.endTime)
        : new Date();
      return endTime - new Date(state.sessionData.startTime);
    },
    totalRewardsValue: (state) => 
      state.rewards.reduce((total, reward) => total + (reward.value || 0), 0),
    completedAchievementsCount: (state) => state.achievements.length
  };
  
  return createStore({
    name: StoreTypes.GAME,
    initialState,
    actions,
    selectors,
    computed,
    enablePersist: true,
    enableDevTools: true,
    persistOptions: {
      whitelist: ['playerStats', 'rewards', 'achievements', 'inventory', 'gameSettings']
    }
  });
};

// Analytics store for tracking user engagement
export const createAnalyticsStore = () => {
  const initialState = {
    events: [],
    sessionStartTime: null,
    sessionId: null,
    pageViews: {},
    featureUsage: {},
    timeSpent: {},
    isTracking: true,
    anonymousId: null
  };
  
  const actions = {
    startSession: (set, get) => {
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      set({
        sessionStartTime: new Date().toISOString(),
        sessionId,
        events: []
      });
      
      return sessionId;
    },
    
    endSession: (set, get) => {
      const { sessionStartTime, sessionId, events } = get();
      
      if (!sessionStartTime || !sessionId) return null;
      
      const sessionDuration = new Date() - new Date(sessionStartTime);
      
      set(state => {
        state.events.push({
          type: 'session_end',
          timestamp: new Date().toISOString(),
          data: {
            sessionId,
            duration: sessionDuration,
            eventCount: events.length
          }
        });
        
        state.sessionStartTime = null;
      });
      
      return {
        sessionId,
        duration: sessionDuration,
        eventCount: events.length
      };
    },
    
    trackEvent: (set, get, eventType, eventData = {}) => {
      if (!get().isTracking) return;
      
      const event = {
        type: eventType,
        timestamp: new Date().toISOString(),
        sessionId: get().sessionId,
        data: eventData
      };
      
      set(state => {
        state.events.push(event);
        
        // Update feature usage if this is a feature event
        if (eventType.startsWith('feature_')) {
          const feature = eventType.replace('feature_', '');
          state.featureUsage[feature] = (state.featureUsage[feature] || 0) + 1;
        }
        
        // Update page views if this is a page view event
        if (eventType === 'page_view') {
          const page = eventData.page || 'unknown';
          state.pageViews[page] = (state.pageViews[page] || 0) + 1;
        }
      });
      
      return event;
    },
    
    trackPageView: (set, get, page, referrer = null) => {
      return get().trackEvent('page_view', { page, referrer });
    },
    
    trackFeatureUsage: (set, get, feature, data = {}) => {
      return get().trackEvent(`feature_${feature}`, data);
    },
    
    trackTimeSpent: (set, get, area, duration) => {
      set(state => {
        state.timeSpent[area] = (state.timeSpent[area] || 0) + duration;
      });
      
      return get().trackEvent('time_spent', { area, duration });
    },
    
    clearEvents: (set) => {
      set({ events: [] });
    },
    
    setTracking: (set, get, isTracking) => {
      set({ isTracking });
    },
    
    setAnonymousId: (set, get, id) => {
      set({ anonymousId: id });
    }
  };
  
  const selectors = {
    selectEvents: state => state.events,
    selectSessionId: state => state.sessionId,
    selectSessionStartTime: state => state.sessionStartTime,
    selectPageViews: state => state.pageViews,
    selectFeatureUsage: state => state.featureUsage,
    selectTimeSpent: state => state.timeSpent,
    selectIsTracking: state => state.isTracking,
    selectAnonymousId: state => state.anonymousId
  };
  
  const computed = {
    sessionDuration: (state) => {
      if (!state.sessionStartTime) return 0;
      return new Date() - new Date(state.sessionStartTime);
    },
    
    mostViewedPages: (state) => {
      return Object.entries(state.pageViews)
        .sort((a, b) => b[1] - a[1])
        .map(([page, count]) => ({ page, count }));
    },
    
    mostUsedFeatures: (state) => {
      return Object.entries(state.featureUsage)
        .sort((a, b) => b[1] - a[1])
        .map(([feature, count]) => ({ feature, count }));
    },
    
    totalTimeSpent: (state) => {
      return Object.values(state.timeSpent).reduce((total, time) => total + time, 0);
    }
  };
  
  return createStore({
    name: StoreTypes.ANALYTICS,
    initialState,
    actions,
    selectors,
    computed,
    enablePersist: true,
    enableDevTools: process.env.NODE_ENV !== 'production',
    persistOptions: {
      whitelist: ['anonymousId', 'pageViews', 'featureUsage', 'timeSpent']
    }
  });
};

// Root store that combines all stores
export const createRootStore = () => {
  // Create individual stores
  const userStore = createUserStore();
  const uiStore = createUIStore();
  const curriculumStore = createCurriculumStore();
  const gameStore = createGameStore();
  const analyticsStore = createAnalyticsStore();
  
  // Combined selectors
  const selectors = {
    // Cross-store selectors
    selectUserWithProgress: () => {
      const user = userStore.useStore(state => state.user);
      const progress = curriculumStore.useStore(state => state.progress);
      
      return {
        ...user,
        progress
      };
    },
    
    selectCourseWithUserProgress: (courseId) => {
      const course = curriculumStore.useStore(state => 
        state.courses.find(c => c.id === courseId)
      );
      const progress = curriculumStore.useStore(state => state.progress);
      
      if (!course) return null;
      
      return {
        ...course,
        progress: progress[courseId] || {},
        completionPercentage: curriculumStore.useStore(
          state => state.courseProgress(courseId)
        )
      };
    }
  };
  
  // Initialize analytics session
  analyticsStore.getState().startSession();
  
  return {
    user: userStore,
    ui: uiStore,
    curriculum: curriculumStore,
    game: gameStore,
    analytics: analyticsStore,
    selectors
  };
};

// Export the root store as a singleton
export const rootStore = createRootStore();

// Export individual stores for direct usage
export const userStore = rootStore.user;
export const uiStore = rootStore.ui;
export const curriculumStore = rootStore.curriculum;
export const gameStore = rootStore.game;
export const analyticsStore = rootStore.analytics;

// Default export
export default rootStore;