import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";

// UI Theme and Design System
export interface UITheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontFamily: string;
    sizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    weights: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  animations: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: {
      easeIn: string;
      easeOut: string;
      easeInOut: string;
    };
  };
}

const defaultTheme: UITheme = {
  colors: {
    primary: "#6366f1",
    secondary: "#8b5cf6",
    accent: "#f59e0b",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    sizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      xxl: "1.5rem",
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  },
  animations: {
    duration: {
      fast: 0.15,
      normal: 0.3,
      slow: 0.5,
    },
    easing: {
      easeIn: "cubic-bezier(0.4, 0, 1, 1)",
      easeOut: "cubic-bezier(0, 0, 0.2, 1)",
      easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
};

// UI Context
const UIContext = createContext<{
  theme: UITheme;
  setTheme: (theme: UITheme) => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
}>({
  theme: defaultTheme,
  setTheme: () => {},
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
});

export const useUI = () => useContext(UIContext);

// Notification System
export interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// UI Provider Component
export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<UITheme>(defaultTheme);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      duration: notification.duration || 5000,
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        theme,
        setTheme,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

// Enhanced Button Component
export interface ButtonProps {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  onClick,
  children,
  className = "",
}) => {
  const { theme } = useUI();

  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.text,
      border: "none",
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      color: theme.colors.text,
      border: "none",
    },
    accent: {
      backgroundColor: theme.colors.accent,
      color: theme.colors.background,
      border: "none",
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.colors.text,
      border: `1px solid ${theme.colors.text}`,
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: theme.colors.text,
      border: "none",
    },
  };

  const sizes = {
    sm: {
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      fontSize: theme.typography.sizes.sm,
    },
    md: {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      fontSize: theme.typography.sizes.md,
    },
    lg: {
      padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      fontSize: theme.typography.sizes.lg,
    },
  };

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: theme.borderRadius.lg,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.weights.medium,
        boxShadow: theme.shadows.md,
      }}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: theme.animations.duration.normal }}
    >
      {loading && (
        <motion.div
          className="mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          ⟳
        </motion.div>
      )}

      {icon && iconPosition === "left" && !loading && <span className="mr-2">{icon}</span>}

      {children}

      {icon && iconPosition === "right" && !loading && <span className="ml-2">{icon}</span>}
    </motion.button>
  );
};

// Enhanced Card Component
export interface CardProps {
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  variant = "default",
  padding = "md",
  children,
  className = "",
  onClick,
  hoverable = false,
}) => {
  const { theme } = useUI();

  const variants = {
    default: {
      backgroundColor: theme.colors.surface,
      border: "none",
      boxShadow: theme.shadows.sm,
    },
    elevated: {
      backgroundColor: theme.colors.surface,
      border: "none",
      boxShadow: theme.shadows.lg,
    },
    outlined: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.textSecondary}`,
      boxShadow: "none",
    },
  };

  const paddings = {
    sm: theme.spacing.md,
    md: theme.spacing.lg,
    lg: theme.spacing.xl,
  };

  return (
    <motion.div
      className={`
        rounded-lg overflow-hidden
        ${onClick || hoverable ? "cursor-pointer" : ""}
        ${className}
      `}
      style={{
        ...variants[variant],
        padding: paddings[padding],
        borderRadius: theme.borderRadius.lg,
      }}
      onClick={onClick}
      whileHover={hoverable || onClick ? { scale: 1.02, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: theme.animations.duration.normal }}
    >
      {children}
    </motion.div>
  );
};

// Progress Bar Component
export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  showLabel = false,
  animated = true,
  className = "",
}) => {
  const { theme } = useUI();
  const percentage = Math.min((value / max) * 100, 100);

  const variants = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    error: theme.colors.error,
  };

  const sizes = {
    sm: "4px",
    md: "8px",
    lg: "12px",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span style={{ color: theme.colors.text, fontSize: theme.typography.sizes.sm }}>
            Progress
          </span>
          <span style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div
        className="w-full bg-gray-700 rounded-full overflow-hidden"
        style={{
          height: sizes[size],
          borderRadius: theme.borderRadius.full,
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: variants[variant],
            borderRadius: theme.borderRadius.full,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? theme.animations.duration.slow : 0,
            ease: theme.animations.easing.easeOut,
          }}
        />
      </div>
    </div>
  );
};

// Notification Component
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification, theme } = useUI();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className="max-w-sm p-4 rounded-lg shadow-lg"
            style={{
              backgroundColor: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
              boxShadow: theme.shadows.lg,
            }}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: theme.animations.duration.normal }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === "success" && <span className="text-green-400">✓</span>}
                {notification.type === "warning" && <span className="text-yellow-400">⚠</span>}
                {notification.type === "error" && <span className="text-red-400">✕</span>}
                {notification.type === "info" && <span className="text-blue-400">ℹ</span>}
              </div>

              <div className="ml-3 flex-1">
                <h4 className="font-medium" style={{ color: theme.colors.text }}>
                  {notification.title}
                </h4>
                <p className="mt-1 text-sm" style={{ color: theme.colors.textSecondary }}>
                  {notification.message}
                </p>

                {notification.actions && (
                  <div className="mt-3 flex space-x-2">
                    {notification.actions.map((action, index) => (
                      <Button key={index} variant="ghost" size="sm" onClick={action.action}>
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="ml-4 text-gray-400 hover:text-gray-200"
                onClick={() => removeNotification(notification.id)}
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Accessibility System
export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large" | "extra-large";
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
}

export const AccessibilityProvider: React.FC<{
  children: React.ReactNode;
  config?: Partial<AccessibilityConfig>;
}> = ({ children, config = {} }) => {
  const [accessibilityConfig, setAccessibilityConfig] = useState<AccessibilityConfig>({
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium",
    screenReader: false,
    keyboardNavigation: true,
    colorBlindFriendly: false,
    ...config,
  });

  useEffect(() => {
    // Apply accessibility settings to document
    document.documentElement.style.setProperty(
      "--font-size-multiplier",
      getFontSizeMultiplier(accessibilityConfig.fontSize),
    );

    if (accessibilityConfig.reducedMotion) {
      document.documentElement.style.setProperty("--animation-duration", "0s");
    }

    if (accessibilityConfig.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [accessibilityConfig]);

  const getFontSizeMultiplier = (size: AccessibilityConfig["fontSize"]): string => {
    switch (size) {
      case "small":
        return "0.875";
      case "medium":
        return "1";
      case "large":
        return "1.125";
      case "extra-large":
        return "1.25";
      default:
        return "1";
    }
  };

  return <div data-accessibility-config={JSON.stringify(accessibilityConfig)}>{children}</div>;
};

// Focus Management Hook
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  };

  return { focusedElement, setFocusedElement, trapFocus };
};

// Screen Reader Announcements
export const useScreenReader = () => {
  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleKeyNavigation = (
    event: KeyboardEvent,
    items: HTMLElement[],
    onSelect?: (index: number) => void,
  ) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        setCurrentIndex((prev) => (prev + 1) % items.length);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        onSelect?.(currentIndex);
        break;
      case "Home":
        event.preventDefault();
        setCurrentIndex(0);
        break;
      case "End":
        event.preventDefault();
        setCurrentIndex(items.length - 1);
        break;
    }

    items[currentIndex]?.focus();
  };

  return { currentIndex, setCurrentIndex, handleKeyNavigation };
};

export default UISystem;
