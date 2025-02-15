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

export default http;
