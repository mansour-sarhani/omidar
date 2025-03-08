import bcrypt from 'bcryptjs';

async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export { verifyPassword };
