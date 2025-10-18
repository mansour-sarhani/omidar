import { generateRefreshToken } from '@/utils/jwt';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = '/';

// Create axios instance with performance optimizations
const http = axios.create({
    baseURL,
    timeout: 30000, // 30 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
    // Enable compression
    decompress: true,
    // Connection pooling
    maxRedirects: 5,
    maxContentLength: 50 * 1024 * 1024, // 50MB
});

// Request cache for GET requests
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

http.interceptors.request.use(
    (config) => {
        const token = Cookies.get('om_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Add cache key for GET requests
        if (config.method === 'get') {
            const cacheKey = `${config.url}?${JSON.stringify(config.params || {})}`;
            const cachedResponse = requestCache.get(cacheKey);
            
            if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
                // Return cached response
                config.adapter = () => Promise.resolve(cachedResponse.data);
            } else {
                // Store cache key for response interceptor
                config.cacheKey = cacheKey;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        // Cache GET responses
        if (response.config.method === 'get' && response.config.cacheKey) {
            requestCache.set(response.config.cacheKey, {
                data: response,
                timestamp: Date.now(),
            });
        }

        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle network errors gracefully
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject(new Error('Network connection failed. Please check your internet connection.'));
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            Cookies.remove('om_token');
            Cookies.remove('refresh_token');
            
            // Only redirect if we're in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }

            // TODO: Implement proper token refresh logic
            // originalRequest._retry = true;
            // try {
            //     const refreshToken = Cookies.get('refresh_token');
            //     const response = await axios.post('/api/auth/refresh', {
            //         token: refreshToken,
            //     });
            //     if (response.data.success) {
            //         const newToken = response.data.token;
            //         Cookies.set('om_token', newToken, {
            //             expires: 30,
            //             secure: true,
            //             sameSite: 'Lax',
            //         });

            //         const newRefreshToken = generateRefreshToken('user');
            //         Cookies.set('refresh_token', newRefreshToken, {
            //             expires: 60,
            //             secure: true,
            //             sameSite: 'Lax',
            //         });

            //         originalRequest.headers.Authorization = `Bearer ${newToken}`;

            //         return http(originalRequest);
            //     }
            // } catch (err) {
            //     console.error('Token refresh failed:', err);
            //     Cookies.remove('om_token');
            //     Cookies.remove('refresh_token');
            //     if (typeof window !== 'undefined') {
            //         window.location.href = '/';
            //     }
            // }
        }
        return Promise.reject(error);
    }
);

// Clean up old cache entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requestCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            requestCache.delete(key);
        }
    }
}, CACHE_DURATION);

export default http;
