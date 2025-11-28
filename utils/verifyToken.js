import { verify } from 'jsonwebtoken';

function verifyToken(token, secretKey) {
    try {
        const result = verify(token, secretKey);
        return {
            type: result.type,
            userId: result.userId,
            iat: result.iat,
            exp: result.exp,
        };
    } catch (e) {
        return false;
    }
}

export { verifyToken };
