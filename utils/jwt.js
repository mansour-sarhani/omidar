import jwt from 'jsonwebtoken';

export const generateToken = (type, userId) => {
    const payload = {
        type,
        userId,
        iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    return token;
};

export const generateRefreshToken = (type, userId) => {
    const payload = {
        type,
        userId,
        iat: Math.floor(Date.now() / 1000),
    };

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '60d',
    });

    return refreshToken;
};
