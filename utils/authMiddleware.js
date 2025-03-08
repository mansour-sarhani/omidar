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

    if (validToken.type === 'user') {
        const user = await User.findOne({ token: token });
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'کاربر پیدا نشد.' },
                { status: 404 }
            );
        }
        req.type = 'user';
        req.refId = user._id;
    }

    if (validToken.type === 'client') {
        const client = await Client.findOne({ token: token });
        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }
        req.type = 'client';
        req.refId = client._id;
    }
    return null;
}
