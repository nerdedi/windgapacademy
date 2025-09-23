// Portions of this file were generated with the assistance of GitHub Copilot

// Export all analytics modules
export { default as AnalyticsService } from "./AnalyticsService";
export { default as LearningModel } from "./LearningModel";
export { default as AnalyticsVisualizer } from "./AnalyticsVisualizer";
export { default as AnalyticsDashboard } from "./AnalyticsDashboard";
export { default as useComponentAnalytics } from "./useComponentAnalytics";
export { AnalyticsProvider, useAnalytics, default as AnalyticsContext } from "./AnalyticsContext";

/**
 * Analytics Module
 *
 * A sophisticated analytics system that uses machine learning to track user engagement
 * and provide insights for curriculum improvement.
 *
 * Key components:
 * - AnalyticsService: Core service for tracking and analyzing user events
 * - LearningModel: ML model for processing analytics data
 * - AnalyticsVisualizer: Component for visualizing analytics data
 * - AnalyticsDashboard: Admin dashboard for monitoring analytics
 * - useComponentAnalytics: Hook for easy integration of analytics into components
 * - AnalyticsProvider: Context provider for analytics functionality
 * - useAnalytics: Hook for accessing analytics functions and data
 *
 * Usage:
 *
 * 1. Wrap your app with the AnalyticsProvider (see below):
 *    Example:
 *    import { AnalyticsProvider } from './analytics';
 *    // In your app root, wrap your components with AnalyticsProvider.
 *    // See documentation for JSX usage.
 *
 * 2. Use the analytics hook in your components:
 *    Example:
 *    import { useAnalytics } from './analytics';
 *    const { trackEvent } = useAnalytics();
 *    // Call trackEvent('button_click', { buttonId: 'submit' }) on button click.
 *
 * 3. Use the component analytics hook for automatic tracking:
 *    Example:
 *    import { useComponentAnalytics } from './analytics';
 *    const { componentRef, getClickHandler } = useComponentAnalytics('MyComponent');
 *    // Attach componentRef to your element and use getClickHandler for event tracking.
 *
 * 4. Display analytics visualizations:
 *    Example:
 *    import { AnalyticsVisualizer } from './analytics';
 *    // Render <AnalyticsVisualizer /> in your component (see documentation).
 *
 * 5. Admin dashboard:
 *    Example:
 *    import { AnalyticsDashboard } from './analytics';
 *    // Render <AnalyticsDashboard /> in your admin page (see documentation).
 */
