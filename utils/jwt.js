import jwt from 'jsonwebtoken';

const generateToken = (data, type) => {
    const payload = {
        type,
        Id: data.Id,
        firstName: data.firstName,
        lastName: data.lastName,
        nationalId: data.nationalId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return token;
};

export default generateToken;
