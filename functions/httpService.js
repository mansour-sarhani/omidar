import axios from 'axios';
import { getAuthCookie, removeAllAuthCookies, setAuthCookie } from '@/utils/cookieUtils';

const baseURL = '/';

const http = axios.create({
    baseURL,
});

http.interceptors.request.use(
    (config) => {
        const token = getAuthCookie('om_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            removeAllAuthCookies();
            window.location.href = '/';

            // TODO: Uncomment and fix token refresh logic if needed
            // originalRequest._retry = true;
            // try {
            //     const refreshToken = getAuthCookie('refresh_token');
            //     if (refreshToken) {
            //         const response = await axios.post('/api/auth/refresh', {
            //             token: refreshToken,
            //         });
            //         if (response.data.success) {
            //             const newToken = response.data.token;
            //             setAuthCookie('om_token', newToken, 30);
            //             
            //             // Note: Refresh token refresh would need to be implemented
            //             // const newRefreshToken = generateRefreshToken('user');
            //             // setAuthCookie('refresh_token', newRefreshToken, 60);
            //             
            //             originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //             return http(originalRequest);
            //         }
            //     }
            // } catch (err) {
            //     console.error('Token refresh failed:', err);
            //     removeAllAuthCookies();
            //     window.location.href = '/';
            // }
        }
        return Promise.reject(error);
    }
);

export default http;
