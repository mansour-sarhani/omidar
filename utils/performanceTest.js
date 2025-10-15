// Performance testing utilities for development and monitoring

export class PerformanceProfiler {
    constructor(name) {
        this.name = name;
        this.marks = new Map();
        this.measures = new Map();
    }

    mark(label) {
        const markName = `${this.name}-${label}`;
        if (typeof performance !== 'undefined') {
            performance.mark(markName);
            this.marks.set(label, performance.now());
        }
        return this;
    }

    measure(startLabel, endLabel = null) {
        const measureName = `${this.name}-${startLabel}-${endLabel || 'end'}`;
        
        if (typeof performance !== 'undefined') {
            try {
                if (endLabel) {
                    performance.measure(measureName, `${this.name}-${startLabel}`, `${this.name}-${endLabel}`);
                } else {
                    performance.measure(measureName, `${this.name}-${startLabel}`);
                }
                
                const measure = performance.getEntriesByName(measureName)[0];
                this.measures.set(`${startLabel}-${endLabel || 'end'}`, measure.duration);
                
                return measure.duration;
            } catch (error) {
                console.warn('Performance measurement failed:', error);
                return 0;
            }
        }
        
        return 0;
    }

    getResults() {
        return {
            marks: Object.fromEntries(this.marks),
            measures: Object.fromEntries(this.measures),
        };
    }

    clear() {
        if (typeof performance !== 'undefined') {
            // Clear performance entries for this profiler
            const entries = performance.getEntriesByType('mark')
                .filter(entry => entry.name.startsWith(this.name));
            
            entries.forEach(entry => {
                try {
                    performance.clearMarks(entry.name);
                } catch (error) {
                    console.warn('Failed to clear mark:', error);
                }
            });
        }
        
        this.marks.clear();
        this.measures.clear();
    }

    report() {
        const results = this.getResults();
        console.group(`Performance Report: ${this.name}`);
        
        if (Object.keys(results.measures).length > 0) {
            console.table(results.measures);
        } else {
            console.log('No measurements recorded');
        }
        
        console.groupEnd();
        return results;
    }
}

// Component performance testing
export const testComponentPerformance = (Component, props = {}, iterations = 100) => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
        return null;
    }

    const profiler = new PerformanceProfiler(`Component-${Component.name || 'Unknown'}`);
    const results = [];

    for (let i = 0; i < iterations; i++) {
        profiler.mark(`render-start-${i}`);
        
        // Simulate component render (in a real scenario, you'd use React's profiler)
        const startTime = performance.now();
        
        // This is a simplified test - in practice, you'd use React DevTools Profiler API
        try {
            // Component rendering simulation
            const element = Component(props);
            const endTime = performance.now();
            
            results.push(endTime - startTime);
            profiler.mark(`render-end-${i}`);
            profiler.measure(`render-start-${i}`, `render-end-${i}`);
        } catch (error) {
            console.warn('Component test failed:', error);
        }
    }

    const avgRenderTime = results.reduce((sum, time) => sum + time, 0) / results.length;
    const maxRenderTime = Math.max(...results);
    const minRenderTime = Math.min(...results);

    const report = {
        component: Component.name || 'Unknown',
        iterations,
        averageRenderTime: avgRenderTime.toFixed(2),
        maxRenderTime: maxRenderTime.toFixed(2),
        minRenderTime: minRenderTime.toFixed(2),
        results: results.map(time => parseFloat(time.toFixed(2))),
    };

    console.log('Component Performance Test Results:', report);
    profiler.clear();
    
    return report;
};

// Bundle size analyzer
export const analyzeBundleSize = async () => {
    if (typeof window === 'undefined') return null;

    try {
        const navigation = performance.getEntriesByType('navigation')[0];
        const resources = performance.getEntriesByType('resource');
        
        const jsResources = resources.filter(resource => 
            resource.name.includes('.js') && !resource.name.includes('hot-update')
        );
        
        const cssResources = resources.filter(resource => 
            resource.name.includes('.css')
        );

        const totalJSSize = jsResources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);

        const totalCSSSize = cssResources.reduce((total, resource) => {
            return total + (resource.transferSize || 0);
        }, 0);

        const analysis = {
            navigation: {
                loadTime: navigation.loadEventEnd - navigation.loadEventStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                firstPaint: navigation.loadEventStart,
            },
            resources: {
                total: resources.length,
                javascript: {
                    count: jsResources.length,
                    totalSize: totalJSSize,
                    averageSize: totalJSSize / jsResources.length || 0,
                },
                css: {
                    count: cssResources.length,
                    totalSize: totalCSSSize,
                    averageSize: totalCSSSize / cssResources.length || 0,
                },
            },
            recommendations: generateRecommendations(totalJSSize, totalCSSSize, jsResources.length),
        };

        console.group('Bundle Size Analysis');
        console.table(analysis.resources);
        console.log('Recommendations:', analysis.recommendations);
        console.groupEnd();

        return analysis;
    } catch (error) {
        console.error('Bundle analysis failed:', error);
        return null;
    }
};

// Generate performance recommendations
const generateRecommendations = (jsSize, cssSize, jsCount) => {
    const recommendations = [];
    
    if (jsSize > 1024 * 1024) { // 1MB
        recommendations.push('Consider code splitting - JavaScript bundle is over 1MB');
    }
    
    if (cssSize > 512 * 1024) { // 512KB
        recommendations.push('Consider CSS optimization - CSS bundle is over 512KB');
    }
    
    if (jsCount > 10) {
        recommendations.push('Consider reducing the number of JavaScript files through bundling');
    }
    
    if (recommendations.length === 0) {
        recommendations.push('Bundle sizes are within recommended limits');
    }
    
    return recommendations;
};

// Memory usage monitoring
export const monitorMemoryUsage = (interval = 5000) => {
    if (typeof window === 'undefined' || !window.performance?.memory) {
        console.warn('Memory monitoring not available');
        return null;
    }

    const monitor = {
        isRunning: false,
        intervalId: null,
        history: [],
        
        start() {
            if (this.isRunning) return;
            
            this.isRunning = true;
            this.intervalId = setInterval(() => {
                const memory = window.performance.memory;
                const usage = {
                    timestamp: Date.now(),
                    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
                };
                
                this.history.push(usage);
                
                // Keep only last 50 entries
                if (this.history.length > 50) {
                    this.history.shift();
                }
                
                // Warn if memory usage is high
                if (usage.used > usage.limit * 0.8) {
                    console.warn('High memory usage detected:', usage);
                }
            }, interval);
        },
        
        stop() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.isRunning = false;
        },
        
        getReport() {
            if (this.history.length === 0) return null;
            
            const latest = this.history[this.history.length - 1];
            const peak = this.history.reduce((max, current) => 
                current.used > max.used ? current : max
            );
            
            return {
                current: latest,
                peak: peak,
                average: this.history.reduce((sum, entry) => sum + entry.used, 0) / this.history.length,
                history: this.history,
            };
        }
    };
    
    return monitor;
};

// Web Vitals measurement
export const measureWebVitals = () => {
    if (typeof window === 'undefined') return;

    // Core Web Vitals
    const vitals = {
        FCP: null, // First Contentful Paint
        LCP: null, // Largest Contentful Paint
        FID: null, // First Input Delay
        CLS: null, // Cumulative Layout Shift
        TTFB: null, // Time to First Byte
    };

    // Measure TTFB
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
        vitals.TTFB = navigation.responseStart - navigation.requestStart;
    }

    // Observe paint entries
    if ('PerformanceObserver' in window) {
        try {
            const paintObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.name === 'first-contentful-paint') {
                        vitals.FCP = entry.startTime;
                    }
                });
            });
            paintObserver.observe({ entryTypes: ['paint'] });

            // Observe layout shifts
            const clsObserver = new PerformanceObserver((list) => {
                let clsValue = 0;
                list.getEntries().forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                vitals.CLS = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });

            // Observe largest contentful paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                vitals.LCP = lastEntry.startTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        } catch (error) {
            console.warn('Performance Observer not fully supported:', error);
        }
    }

    // Return function to get current vitals
    return () => vitals;
};

export default {
    PerformanceProfiler,
    testComponentPerformance,
    analyzeBundleSize,
    monitorMemoryUsage,
    measureWebVitals,
};