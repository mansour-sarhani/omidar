import { verify, sign } from 'jsonwebtoken';
import Cookies from 'js-cookie';

export function refreshTokenCheck(refreshToken, secretKey) {
    const decoded = verify(refreshToken, secretKey);
    const newToken = sign({ userId: decoded.userId }, secretKey, {
        expiresIn: '30d',
    });

    Cookies.set('om_token', newToken, {
        expires: 30,
        secure: true,
        sameSite: 'Lax',
    });

    return newToken;
}
