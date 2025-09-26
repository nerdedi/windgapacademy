// Performance optimization utilities for Windgap Academy
import React, { lazy, Suspense } from "react";

// Bundle splitting utility
export const createLazyComponent = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);

  return function WrappedLazyComponent(props) {
    return (
      <Suspense
        fallback={fallback || <div className="animate-pulse bg-gray-200 h-64 rounded"></div>}
      >
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Image optimization
export const OptimizedImage = ({ src, alt, className, lazy = true, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      {...props}
    />
  );
};

// Memoization helper
export const createMemoComponent = (Component, areEqual) => {
  return React.memo(Component, areEqual);
};

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleItems = React.useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length,
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight,
    }));
  }, [items, itemHeight, scrollTop, containerHeight]);

  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    onScroll: (e) => setScrollTop(e.target.scrollTop),
  };
};

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
  }

  // Mark performance timing
  mark(name) {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  }

  // Measure performance between two marks
  measure(name, startMark, endMark) {
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
        const measures = window.performance.getEntriesByName(name, "measure");
        const lastMeasure = measures[measures.length - 1];
        return lastMeasure ? lastMeasure.duration : 0;
      } catch (e) {
        console.warn("Performance measurement failed:", e);
        return 0;
      }
    }
    return 0;
  }

  // Monitor component render times
  monitorComponent(componentName, renderFunction) {
    return (...args) => {
      const startMark = `${componentName}-render-start`;
      const endMark = `${componentName}-render-end`;

      this.mark(startMark);
      const result = renderFunction(...args);
      this.mark(endMark);

      const duration = this.measure(`${componentName}-render`, startMark, endMark);

      if (duration > 16) {
        // More than one frame (16ms)
        console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    };
  }

  // Monitor network requests
  monitorFetch(url, options = {}) {
    const startTime = performance.now();

    return fetch(url, options)
      .then((response) => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Network request to ${url} took ${duration.toFixed(2)}ms`);

        if (duration > 1000) {
          console.warn(`Slow network request: ${url} took ${duration.toFixed(2)}ms`);
        }

        return response;
      })
      .catch((error) => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.error(`Network request to ${url} failed after ${duration.toFixed(2)}ms:`, error);
        throw error;
      });
  }

  // Get performance metrics
  getMetrics() {
    if (!window.performance) return {};

    const navigation = window.performance.getEntriesByType("navigation")[0];
    const paint = window.performance.getEntriesByType("paint");

    return {
      // Navigation timing
      domContentLoaded: navigation
        ? navigation.domContentLoadedEventEnd - navigation.fetchStart
        : 0,
      loadComplete: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,

      // Paint timing
      firstPaint: paint.find((entry) => entry.name === "first-paint")?.startTime || 0,
      firstContentfulPaint:
        paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0,

      // Memory (if available)
      memory: window.performance.memory
        ? {
            used: window.performance.memory.usedJSHeapSize,
            total: window.performance.memory.totalJSHeapSize,
            limit: window.performance.memory.jsHeapSizeLimit,
          }
        : null,
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Web Worker utility for offloading heavy computations
export class WorkerPool {
  constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
    this.workers = [];
    this.queue = [];
    this.busyWorkers = new Set();

    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      this.workers.push(worker);
    }
  }

  execute(data) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find((worker) => !this.busyWorkers.has(worker));

      if (availableWorker) {
        this.runTask(availableWorker, data, resolve, reject);
      } else {
        this.queue.push({ data, resolve, reject });
      }
    });
  }

  runTask(worker, data, resolve, reject) {
    this.busyWorkers.add(worker);

    const handleMessage = (event) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      this.busyWorkers.delete(worker);

      resolve(event.data);
      this.processQueue();
    };

    const handleError = (error) => {
      worker.removeEventListener("message", handleMessage);
      worker.removeEventListener("error", handleError);
      this.busyWorkers.delete(worker);

      reject(error);
      this.processQueue();
    };

    worker.addEventListener("message", handleMessage);
    worker.addEventListener("error", handleError);
    worker.postMessage(data);
  }

  processQueue() {
    if (this.queue.length === 0) return;

    const availableWorker = this.workers.find((worker) => !this.busyWorkers.has(worker));
    if (availableWorker) {
      const { data, resolve, reject } = this.queue.shift();
      this.runTask(availableWorker, data, resolve, reject);
    }
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
    this.queue = [];
    this.busyWorkers.clear();
  }
}

// Resource preloading
export const preloadResource = (href, as = "script", crossorigin = false) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = "anonymous";
  document.head.appendChild(link);
};

// CSS-in-JS optimization
export const createStyleSheet = (styles) => {
  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(styles);
  return styleSheet;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [element, setElement] = React.useState(null);

  React.useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [element, options]);

  return [setElement, isIntersecting];
};

// Memory management utilities
export const cleanupResources = () => {
  // Clean up any global listeners
  if (window.WindgapPlatform?.cleanup) {
    window.WindgapPlatform.cleanup();
  }

  // Clear any cached data that's no longer needed
  if ("caches" in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (cacheName.includes("old") || cacheName.includes("temp")) {
          caches.delete(cacheName);
        }
      });
    });
  }
};

export default {
  createLazyComponent,
  OptimizedImage,
  createMemoComponent,
  useVirtualScroll,
  PerformanceMonitor,
  performanceMonitor,
  WorkerPool,
  preloadResource,
  createStyleSheet,
  useIntersectionObserver,
  cleanupResources,
};
