import { verify } from 'jsonwebtoken';

function verifyToken(token, secretKey) {
    try {
        const result = verify(token, secretKey);
        return {
            type: result.type,
        };
    } catch (e) {
        return false;
    }
}

export { verifyToken };
