import jwt from 'jsonwebtoken';

export const generateToken = (type) => {
    const payload = {
        type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return token;
};

export const generateRefreshToken = (type) => {
    const payload = {
        type,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 24 * 60 * 60,
    };

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

    return refreshToken;
};
