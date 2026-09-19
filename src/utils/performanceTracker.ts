/**
 * Performance & Core Web Vitals Tracking Helper for Kiva Physiotherapy Clinic
 *
 * Measures:
 * - Page view transitions & navigation duration
 * - Core Web Vitals (FCP, LCP, CLS, FID, INP, TTFB) using standard PerformanceObserver APIs
 * - Resource and network latency insights
 *
 * Logs directly to console in dev/monitoring mode and supports a pluggable monitoring handler.
 */

export interface MetricPayload {
  name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'INP' | 'TTFB' | 'PAGE_VIEW' | 'DOM_READY';
  value: number;
  unit: 'ms' | 'score';
  rating: 'good' | 'needs-improvement' | 'poor';
  path: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

export type PerformanceReporter = (metric: MetricPayload) => void;

// Active reporters queue (console by default, pluggable for external APM/analytics)
const reporters: PerformanceReporter[] = [
  (metric) => {
    const color =
      metric.rating === 'good'
        ? '#10b981' // Green
        : metric.rating === 'needs-improvement'
        ? '#f59e0b' // Amber
        : '#ef4444'; // Red

    const formattedValue =
      metric.unit === 'score'
        ? metric.value.toFixed(4)
        : `${Math.round(metric.value)}ms`;

    // Compact diagnostic log for performance monitoring
    if (typeof console !== 'undefined' && console.debug) {
      console.debug(
        `%c[Perf / Web Vitals]%c ${metric.name}: %c${formattedValue}%c (${metric.rating}) on "${metric.path}"`,
        'color: #0d9488; font-weight: bold;',
        'color: inherit;',
        `color: ${color}; font-weight: bold;`,
        'color: #64748b; font-size: 11px;'
      );
    }
  },
];

/**
 * Register a custom reporter (e.g. for Sentry, Google Analytics, Datadog, or custom edge logs).
 */
export function addPerformanceReporter(reporter: PerformanceReporter): () => void {
  reporters.push(reporter);
  return () => {
    const idx = reporters.indexOf(reporter);
    if (idx !== -1) reporters.splice(idx, 1);
  };
}

/**
 * Dispatch metric to all registered monitoring handlers.
 */
function reportMetric(metric: MetricPayload): void {
  for (const reporter of reporters) {
    try {
      reporter(metric);
    } catch {
      // Prevent reporter failures from interrupting application execution
    }
  }
}

/**
 * Evaluates Web Vitals thresholds according to Google Chrome performance standards.
 */
function getRating(
  name: MetricPayload['name'],
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  switch (name) {
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'good';
  }
}

let isInitialized = false;

/**
 * Initializes observers for Core Web Vitals and initial navigation timing.
 * Safe to call in browser environments; safely no-ops on SSR or unsupported browsers.
 */
export function initPerformanceTracking(): void {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  // 1. Initial Page Load & TTFB
  window.addEventListener('load', () => {
    setTimeout(() => {
      try {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0) {
          const nav = navEntries[0];
          const ttfb = nav.responseStart - nav.requestStart;
          if (ttfb >= 0) {
            reportMetric({
              name: 'TTFB',
              value: ttfb,
              unit: 'ms',
              rating: getRating('TTFB', ttfb),
              path: window.location.pathname || '/',
              timestamp: Date.now(),
              details: {
                domInteractive: nav.domInteractive,
                loadEventEnd: nav.loadEventEnd,
                transferSize: nav.transferSize,
              },
            });
          }

          const domReady = nav.domContentLoadedEventEnd - nav.startTime;
          if (domReady > 0) {
            reportMetric({
              name: 'DOM_READY',
              value: domReady,
              unit: 'ms',
              rating: domReady <= 1500 ? 'good' : domReady <= 3000 ? 'needs-improvement' : 'poor',
              path: window.location.pathname || '/',
              timestamp: Date.now(),
            });
          }
        }
      } catch {
        // Safe fallback
      }
    }, 0);
  });

  // 2. Observe Paint timings (First Contentful Paint)
  try {
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('paint')) {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            reportMetric({
              name: 'FCP',
              value: entry.startTime,
              unit: 'ms',
              rating: getRating('FCP', entry.startTime),
              path: window.location.pathname || '/',
              timestamp: Date.now(),
            });
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });
    }
  } catch {
    // Ignore unsupported observer
  }

  // 3. Observe Largest Contentful Paint (LCP)
  try {
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('largest-contentful-paint')) {
      let latestLcp = 0;
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          latestLcp = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Report final LCP on first user interaction or tab hide
      const reportLcpOnce = () => {
        if (latestLcp > 0) {
          reportMetric({
            name: 'LCP',
            value: latestLcp,
            unit: 'ms',
            rating: getRating('LCP', latestLcp),
            path: window.location.pathname || '/',
            timestamp: Date.now(),
          });
          latestLcp = 0;
        }
      };

      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportLcpOnce();
      });
      window.addEventListener('pagehide', reportLcpOnce, { once: true });
    }
  } catch {
    // Ignore unsupported observer
  }

  // 4. Observe Cumulative Layout Shift (CLS)
  try {
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) {
      let clsScore = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          // Ignore shifts with recent user input
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const reportCls = () => {
        if (clsScore > 0) {
          reportMetric({
            name: 'CLS',
            value: clsScore,
            unit: 'score',
            rating: getRating('CLS', clsScore),
            path: window.location.pathname || '/',
            timestamp: Date.now(),
          });
        }
      };

      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') reportCls();
      });
      window.addEventListener('pagehide', reportCls, { once: true });
    }
  } catch {
    // Ignore unsupported observer
  }
}

let lastNavigationStart = typeof performance !== 'undefined' ? performance.now() : 0;

/**
 * Tracks single-page client route transitions and duration.
 */
export function recordPageView(route: string, durationMs?: number): void {
  const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const transitionTime = typeof durationMs === 'number' ? durationMs : Math.max(0, now - lastNavigationStart);
  lastNavigationStart = now;

  reportMetric({
    name: 'PAGE_VIEW',
    value: transitionTime,
    unit: 'ms',
    rating: transitionTime <= 300 ? 'good' : transitionTime <= 800 ? 'needs-improvement' : 'poor',
    path: route.startsWith('/') ? route : `/${route}`,
    timestamp: Date.now(),
    details: {
      route,
      screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : undefined,
    },
  });
}
