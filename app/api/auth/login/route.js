import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { verifyPassword } from '@/utils/verifyPassword';
import Client from '@/models/Client';
import User from '@/models/User';

//CLIENT | USER LOGIN => "/api/auth/login"
export async function POST(req) {
    await dbConnect();

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        const formData = await req.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        if (type === 'user') {
            const user = await User.findOne({ username });
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
                    { status: 401 }
                );
            }

            const isValid = await verifyPassword(password, user.password);

            if (!isValid) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'نام کاربری یا رمز عبور صحیح نمی باشد.',
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json({ success: true, token: user.token });
        } else if (type === 'client') {
            const client = await Client.findOne({ username });
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
                    { status: 401 }
                );
            }

            const isValid = await verifyPassword(password, client.password);

            if (!isValid) {
                return NextResponse.json(
                    { success: false, message: 'رمز عبور اشتباه است.' },
                    { status: 400 }
                );
            }

            return NextResponse.json({ success: true, token: client.token });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
