import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '@/utils/authMiddleware';
import { hashPassword } from '@/utils/hashPassword';

//GET CURRENT USER BY TOKEN => "/api/user"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'توکن وجود ندارد.' },
                { status: 403 }
            );
        }

        const validToken = verifyToken(token, secretKey);

        if (!validToken) {
            return NextResponse.json(
                { success: false, message: 'توکن معتبر نیست.' },
                { status: 401 }
            );
        }
        const user = await User.findOne({ token });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'کاربر پیدا نشد.' },
                { status: 404 }
            );
        }

        const userData = {
            _id: user._id,
            Id: user.Id,
            token: user.token,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            nationalId: user.nationalId,
            email: user.email,
            mobile: user.mobile,
            status: user.status,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updated,
        };

        return NextResponse.json({ success: true, data: userData });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//User Update Profile => "/api/user"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'توکن وجود ندارد.' },
                { status: 403 }
            );
        }

        const validToken = verifyToken(token, secretKey);
        if (!validToken) {
            return NextResponse.json(
                { success: false, message: 'توکن معتبر نیست.' },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const nationalId = formData.get('nationalId');
        const password = formData.get('password');
        const email = formData.get('email');
        const mobile = formData.get('mobile');

        const user = await User.findOne({ token });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'کاربر پیدا نشد.' },
                { status: 404 }
            );
        }

        if (firstName !== null) {
            user.firstName = firstName;
            user.markModified('firstName');
        }
        if (lastName) {
            user.lastName = lastName;
            user.markModified('lastName');
        }
        if (nationalId) {
            user.nationalId = nationalId;
            user.markModified('nationalId');
        }
        if (password) {
            const hashedPassword = await hashPassword(password);
            user.password = hashedPassword;
            user.markModified('password');
        }
        if (email) {
            user.email = email;
            user.markModified('email');
        }
        if (mobile) {
            user.mobile = mobile;
            user.markModified('mobile');
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
