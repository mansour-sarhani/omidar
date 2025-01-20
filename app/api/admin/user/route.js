import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import Counter from '@/models/Counter';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '@/utils/authMiddleware';
import generateToken from '@/utils/jwt';
import { hashPassword } from '@/utils/hashPassword';

//ADMIN REGISTERS USER => "/api/admin/user"
export async function POST(req) {
    await dbConnect();

    // const authError = await authMiddleware(req);
    // if (authError) {
    //     return authError;
    // }

    try {
        const formData = await req.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const mobile = formData.get('mobile');
        const email = formData.get('email');
        const nationalId = formData.get('nationalId');
        const role = formData.get('role');

        const existingUser = await User.findOne({ nationalId });
        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'این کد ملی قبلا ثبت شده است.',
                },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(nationalId);

        const userData = {
            firstName,
            lastName,
            nationalId,
            username: nationalId,
            password: hashedPassword,
            role,
            mobile,
            email,
        };

        const newUser = new User(userData);

        const counter = await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        newUser.Id = counter.seq;

        const token = generateToken('user');
        newUser.token = token;

        await newUser.save();

        return NextResponse.json({ success: true, data: newUser });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    function userDetails(user) {
        return {
            _id: user._id,
            Id: user.Id,
            username: user.username,
            token: user.token,
            firstName: user.firstName,
            lastName: user.lastName,
            nationalId: user.nationalId,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            avatar: user.avatar,
            notifications: user.notifications,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    try {
        if (userId) {
            //ADMIN GET USER BY ID => "/api/admin/user?userId=66b5be627f158e50829334bb"
            const user = await User.findById(userId);

            if (!user) {
                return NextResponse.json(
                    { success: false, error: 'کاربر پیدا نشد.' },
                    { status: 404 }
                );
            }

            const userData = userDetails(user);

            return NextResponse.json(
                { success: true, data: userData },
                { status: 200 }
            );
        } else {
            //ADMIN GET ALL USERS => "/api/admin/user"
            const users = await User.find({});

            const filteredUsers = users.map(userDetails);

            return NextResponse.json(
                { success: true, data: filteredUsers },
                { status: 200 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//ADMIN UPDATE USER => "/api/admin/user?userId=66b5be627f158e50829334bb"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        const formData = await req.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const nationalId = formData.get('nationalId');
        const username = formData.get('username');
        const password = formData.get('password');
        const email = formData.get('email');
        const mobile = formData.get('mobile');
        const role = formData.get('role');
        const status = formData.get('status');

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'این کاربر وجود ندارد.' },
                { status: 400 }
            );
        }

        if (firstName !== null) {
            user.firstName = firstName;
            user.markModified('firstName');
        }
        if (lastName !== null) {
            user.lastName = lastName;
            user.markModified('lastName');
        }
        if (nationalId !== null) {
            user.nationalId = nationalId;
            user.markModified('nationalId');
        }
        if (username !== null) {
            user.username = username;
            user.markModified('username');
        }
        if (password !== null) {
            const hashedPassword = await hashPassword(password);

            user.password = hashedPassword;
            user.markModified('password');
        }
        if (email !== null) {
            user.email = email;
            user.markModified('email');
        }
        if (mobile !== null) {
            user.mobile = mobile;
            user.markModified('mobile');
        }
        if (role !== null) {
            user.role = role;
            user.markModified('role');
        }
        if (status !== null) {
            user.status = status;
            user.markModified('status');
        }

        const avatarFile = formData.get('avatar');

        if (
            avatarFile &&
            (avatarFile.type === 'image/jpeg' ||
                avatarFile.type === 'image/png' ||
                avatarFile.type === 'image/webp' ||
                avatarFile.type === 'image/svg+xml')
        ) {
            const uniqueName = uuidv4() + path.extname(avatarFile.name);
            const savePath = path.join(
                process.cwd(),
                'public/assets/storage/users/',
                uniqueName
            );

            const directories = [
                'public',
                'public/assets',
                'public/assets',
                'public/assets/storage',
                'public/assets/storage/users',
            ];

            directories.forEach((dir) => {
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
            });

            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            fs.writeFileSync(savePath, buffer);

            if (user.avatar.url) {
                const oldImagePath = path.join(
                    process.cwd(),
                    'public/assets/storage/users/',
                    user.avatar.url
                );
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            user.avatar.url = uniqueName;
            user.markModified('avatar');
        }

        await user.save();

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
