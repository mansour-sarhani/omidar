import Cookies from 'js-cookie';

/**
 * Get cookie configuration based on environment
 * secure flag is only true in production/HTTPS
 */
function getCookieConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    const isHTTPS = typeof window !== 'undefined' && window.location.protocol === 'https:';
    
    return {
        secure: isProduction || isHTTPS,
        sameSite: 'Lax',
    };
}

/**
 * Set authentication cookie
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} expiresInDays - Number of days until expiration
 */
export function setAuthCookie(name, value, expiresInDays = 30) {
    const config = getCookieConfig();
    Cookies.set(name, value, {
        ...config,
        expires: expiresInDays,
    });
}

/**
 * Get authentication cookie
 * @param {string} name - Cookie name
 * @returns {string|undefined} Cookie value or undefined
 */
export function getAuthCookie(name) {
    return Cookies.get(name);
}

/**
 * Remove authentication cookie
 * @param {string} name - Cookie name
 */
export function removeAuthCookie(name) {
    Cookies.remove(name);
}

/**
 * Remove all authentication cookies
 */
export function removeAllAuthCookies() {
    removeAuthCookie('om_token');
    removeAuthCookie('refresh_token');
}

/**
 * Set multiple authentication cookies
 * @param {Object} cookies - Object with cookie names as keys and values as values
 * @param {Object} expires - Object with cookie names as keys and days as values
 */
export function setAuthCookies(cookies, expires = {}) {
    Object.keys(cookies).forEach((key) => {
        const expiresInDays = expires[key] || 30;
        setAuthCookie(key, cookies[key], expiresInDays);
    });
}

