// Performance monitoring utilities

export const measurePerformance = (name, fn) => {
    if (typeof window !== 'undefined' && window.performance) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`Performance: ${name} took ${end - start} milliseconds`);
        return result;
    }
    return fn();
};

export const debounce = (func, wait, immediate) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

export const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };
};

// Lazy loading utility for images
export const lazyLoadImage = (src, placeholder = '/assets/images/placeholder.webp') => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(placeholder);
        img.src = src;
    });
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        import('webpack-bundle-analyzer').then(({ BundleAnalyzerPlugin }) => {
            console.log('Bundle analyzer available');
        }).catch(() => {
            console.log('Bundle analyzer not available');
        });
    }
};

// Web Vitals monitoring
export const reportWebVitals = (metric) => {
    if (process.env.NODE_ENV === 'production') {
        // Log to analytics service
        console.log('Web Vital:', metric);
        
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                event_category: 'Web Vitals',
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.id,
                non_interaction: true,
            });
        }
    }
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
    if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        console.log('Memory Usage:', {
            used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
    }
};

// Preload critical resources
export const preloadCriticalResources = () => {
    if (typeof window !== 'undefined') {
        // Preload critical fonts
        const fontPreload = document.createElement('link');
        fontPreload.rel = 'preload';
        fontPreload.href = '/assets/fonts/Vazir-Regular-FD.woff2';
        fontPreload.as = 'font';
        fontPreload.type = 'font/woff2';
        fontPreload.crossOrigin = 'anonymous';
        document.head.appendChild(fontPreload);

        // Preload critical images
        const criticalImages = [
            '/assets/images/misc/vista-logo-150.webp',
            '/assets/images/website/auth-bg-1.webp'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }
};