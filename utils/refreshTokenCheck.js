import { verify, sign } from 'jsonwebtoken';
import { setAuthCookie } from '@/utils/cookieUtils';

export function refreshTokenCheck(refreshToken, secretKey) {
    const decoded = verify(refreshToken, secretKey);
    const newToken = sign({ userId: decoded.userId }, secretKey, {
        expiresIn: '30d',
    });

    setAuthCookie('om_token', newToken, 30);

    return newToken;
}
