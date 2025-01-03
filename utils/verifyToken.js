import { verify } from 'jsonwebtoken';

function verifyToken(token, secretKey) {
    try {
        const result = verify(token, secretKey);
        return {
            type: result.type,
            Id: result.Id,
            firstName: result.firstName,
            lastName: result.lastName,
            nationalId: result.nationalId,
        };
    } catch (e) {
        return false;
    }
}

export { verifyToken };
