import { useEffect, useCallback, useRef } from 'react';
import { debounce, throttle, measurePerformance } from '@/utils/performance';

export const useDebounce = (callback, delay) => {
    const debouncedCallback = useRef(debounce(callback, delay));
    
    useEffect(() => {
        debouncedCallback.current = debounce(callback, delay);
    }, [callback, delay]);

    return debouncedCallback.current;
};

export const useThrottle = (callback, limit) => {
    const throttledCallback = useRef(throttle(callback, limit));
    
    useEffect(() => {
        throttledCallback.current = throttle(callback, limit);
    }, [callback, limit]);

    return throttledCallback.current;
};

export const usePerformanceMonitor = (componentName) => {
    const renderCount = useRef(0);
    const startTime = useRef(performance.now());

    useEffect(() => {
        renderCount.current += 1;
        const endTime = performance.now();
        const renderTime = endTime - startTime.current;
        
        if (process.env.NODE_ENV === 'development') {
            console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
        }
        
        startTime.current = performance.now();
    });

    const measureFunction = useCallback((name, fn) => {
        return measurePerformance(`${componentName}.${name}`, fn);
    }, [componentName]);

    return { measureFunction, renderCount: renderCount.current };
};

export const useIntersectionObserver = (options = {}) => {
    const elementRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && options.onIntersect) {
                    options.onIntersect(entry);
                }
            });
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '0px',
        });

        observerRef.current.observe(element);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [options.onIntersect, options.threshold, options.rootMargin]);

    return elementRef;
};

export const useLazyLoading = (callback, dependencies = []) => {
    const elementRef = useIntersectionObserver({
        onIntersect: useCallback(() => {
            callback();
        }, dependencies),
        threshold: 0.1,
    });

    return elementRef;
};

export const useMemoryMonitor = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            if (typeof window !== 'undefined' && window.performance?.memory) {
                const memory = window.performance.memory;
                const used = Math.round(memory.usedJSHeapSize / 1048576);
                const total = Math.round(memory.totalJSHeapSize / 1048576);
                
                // Warn if memory usage is high
                if (used > 100) {
                    console.warn(`High memory usage: ${used}MB / ${total}MB`);
                }
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);
};