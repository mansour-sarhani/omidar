import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import User from '@/models/User';
import Client from '@/models/Client';

export async function authMiddleware(req) {
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

    // Use userId from token instead of looking up by token value
    if (validToken.type === 'user') {
        const user = await User.findById(validToken.userId);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'کاربر پیدا نشد.' },
                { status: 404 }
            );
        }
        if (user.status === 'banned') {
            return NextResponse.json(
                { success: false, message: 'حساب کاربری مسدود است.' },
                { status: 403 }
            );
        }
        req.type = 'user';
        req.refId = user._id;
        req.user = user;
    }

    if (validToken.type === 'client') {
        const client = await Client.findById(validToken.userId);
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }
        if (client.status === 'banned') {
            return NextResponse.json(
                { success: false, message: 'حساب کاربری مسدود است.' },
                { status: 403 }
            );
        }
        req.type = 'client';
        req.refId = client._id;
        req.client = client;
    }
    return null;
}
