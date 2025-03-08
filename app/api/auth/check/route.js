import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Client from '@/models/Client';
import User from '@/models/User';
import { authMiddleware } from '@/utils/authMiddleware';

//CHECK USER ENTITY => "/api/auth/check"
export async function POST(req) {
    await dbConnect();

    try {
        const authError = await authMiddleware(req);
        if (authError) {
            return authError;
        }

        const type = req.type;
        const refId = req.refId;

        if (type === 'user') {
            const user = await User.findById(refId);
            if (!user) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'کاربر با این نام کاربری پیدا نشد.',
                    },
                    { status: 404 }
                );
            }

            if (user.status === 'banned') {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'حساب کاربری شما مسدود شده است.',
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                success: true,
                type: 'user',
            });
        } else if (type === 'client') {
            const client = await Client.findById(refId);
            if (!client) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'متقاضی با این نام کاربری پیدا نشد.',
                    },
                    { status: 404 }
                );
            }

            if (client.status === 'banned') {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'حساب کاربری شما مسدود شده است.',
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                success: true,
                type: 'client',
            });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
