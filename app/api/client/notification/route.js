import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verifyToken';
import Client from '@/models/Client';
import Notification from '@/models/Notification';

//GET NOTIFICATIONS OF CURRENT CLIENT => "/api/client/notification"
export async function GET(req) {
    await dbConnect();

    try {
        const cookieStore = cookies();
        const tokenObj = cookieStore.get('om_token');
        const token = tokenObj?.value;
        const secretKey = process.env.JWT_SECRET;

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;

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

        client.notifications.sort((a, b) => {
            if (a.isRead === b.isRead) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.isRead ? 1 : -1;
        });

        if (type === 'read') {
            const readNotifications = client.notifications.filter(
                (item) => item.isRead
            );
            const total = readNotifications.length;
            const paginatedNotifications = readNotifications.slice(
                (page - 1) * limit,
                page * limit
            );

            return NextResponse.json({
                success: true,
                total: total,
                data: paginatedNotifications,
            });
        } else if (type === 'unread') {
            const unReadNotifications = client.notifications.filter(
                (item) => !item.isRead
            );
            const total = unReadNotifications.length;
            const paginatedNotifications = unReadNotifications.slice(
                (page - 1) * limit,
                page * limit
            );

            return NextResponse.json({
                success: true,
                total: total,
                data: paginatedNotifications,
            });
        } else if (type === 'all') {
            const filteredNotifications = client.notifications;
            const total = filteredNotifications.length;
            const paginatedNotifications = filteredNotifications.slice(
                (page - 1) * limit,
                page * limit
            );

            return NextResponse.json({
                success: true,
                total: total,
                data: paginatedNotifications,
            });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

//CLIENT READ NOTIFICATION => "/api/client/notification?notificationId=67798de2b027c1df97f56741"
export async function PUT(req) {
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

        const { searchParams } = new URL(req.url);
        const notificationId = searchParams.get('notificationId');

        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return NextResponse.json(
                { success: false, message: 'پیام پیدا نشد.' },
                { status: 404 }
            );
        }

        notification.isRead = true;
        notification.readAt = new Date();
        notification.markModified('isRead');
        notification.markModified('readAt');

        await notification.save();

        return NextResponse.json({ success: true, data: notification });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
