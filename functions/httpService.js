import { generateRefreshToken } from '@/utils/jwt';
import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = '/';

const http = axios.create({
    baseURL,
});

http.interceptors.request.use(
    (config) => {
        const token = Cookies.get('om_token');
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
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get('refresh_token');
                const response = await axios.post('/api/auth/refresh', {
                    token: refreshToken,
                });
                if (response.data.success) {
                    const newToken = response.data.token;
                    Cookies.set('om_token', newToken, {
                        expires: 30,
                        secure: true,
                        sameSite: 'Lax',
                    });

                    const newRefreshToken = generateRefreshToken('user');
                    Cookies.set('refresh_token', newRefreshToken, {
                        expires: 60,
                        secure: true,
                        sameSite: 'Lax',
                    });

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return http(originalRequest);
                }
            } catch (err) {
                console.error('Token refresh failed:', err);
                Cookies.remove('om_token');
                Cookies.remove('refresh_token');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default http;
