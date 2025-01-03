import bcrypt from "bcryptjs";

async function hashPassword(password) {
	return await bcrypt.hash(password, 12);
}

export { hashPassword };
