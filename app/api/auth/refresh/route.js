import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshTokenCheck } from '@/utils/refreshTokenCheck';

export async function POST(req) {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token');
    const refreshTokenValue = refreshToken?.value;
    const secretKey = process.env.JWT_SECRET;

    if (!refreshToken) {
        return NextResponse.json(
            { success: false, message: 'رفرش توکن وجود ندارد.' },
            { status: 403 }
        );
    }

    try {
        const newToken = refreshTokenCheck(refreshTokenValue, secretKey);

        return NextResponse.json({ success: true, token: newToken });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'رفرش توکن معتبر نیست.' },
            { status: 403 }
        );
    }
}
