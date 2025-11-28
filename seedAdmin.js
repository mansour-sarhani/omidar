import path from 'path';
import { fileURLToPath } from 'url';
import dbConnect from './utils/dbConnect.js';
import User from './models/User.js';
import Counter from './models/Counter.js';
import { hashPassword } from './utils/hashPassword.js';
import { generateToken, generateRefreshToken } from './utils/jwt.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from absolute path to avoid cwd issues
dotenv.config({ path: path.join(__dirname, '.env.local') });

async function seedAdmin() {
    try {
        // Connect to database
        await dbConnect();
        console.log('Connected to database');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Default admin credentials (can be customized)
        const adminData = {
            firstName: 'admin',
            lastName: 'user',
            nationalId: '0323260624',
            username: 'admin',
            email: 'admin@omidar.com',
            mobile: '09123456789',
            role: 'admin',
            status: 'active',
        };

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username: adminData.username }, { email: adminData.email }],
        });

        if (existingUser) {
            console.log('User with this username or email already exists');
            process.exit(1);
        }

        // Hash password (default password is the nationalId, same as in route.js)
        const hashedPassword = await hashPassword(adminData.nationalId);
        adminData.password = hashedPassword;

        // Generate ID using Counter
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        adminData.Id = counter.seq;

        // Generate tokens
        const token = generateToken('user');
        const refreshToken = generateRefreshToken('user');
        adminData.token = token;
        adminData.refreshToken = refreshToken;

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        console.log('Admin user created successfully!');
        console.log('Username:', adminData.username);
        console.log('Email:', adminData.email);
        console.log('Password (default):', adminData.nationalId);
        console.log('Role:', adminData.role);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
}

seedAdmin();
