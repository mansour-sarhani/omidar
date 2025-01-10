import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import Client from '@/models/Client';
import Notification from '@/models/Notification';

//GET NUMBER OF UNREAD NOTIFICATIONS OF CURRENT CLIENT => "/api/client/notification/unread"
export async function GET() {
    await dbConnect();

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'توکن وجود ندارد.' },
                { status: 401 }
            );
        }

        const validToken = verifyToken(token, secretKey);

        if (!validToken) {
            return NextResponse.json(
                { success: false, message: 'توکن معتبر نیست.' },
                { status: 401 }
            );
        }

        const client = await Client.findOne({ token: token }).populate(
            'notifications'
        );

        if (!client) {
            return NextResponse.json(
                { success: false, message: 'متقاضی پیدا نشد.' },
                { status: 404 }
            );
        }

        const unReadNotifications = client.notifications.filter(
            (item) => !item.isRead
        );
        const total = unReadNotifications.length;

        return NextResponse.json({
            success: true,
            total: total,
            data: unReadNotifications,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
