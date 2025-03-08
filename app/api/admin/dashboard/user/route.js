import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import User from '@/models/User';

// ADMIN GET DASHBOARD DATA FOR USERS => "/api/admin/dashboard/user"
export async function GET(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const users = await User.find({});

        const numberOfUsers = users.length;
        const activeUsers = users.filter(
            (user) => !user.deleted && user.status === 'active'
        );
        const inactiveUsers = users.filter(
            (user) => !user.deleted && user.status === 'inactive'
        );
        const bannedUsers = users.filter(
            (user) => !user.deleted && user.status === 'banned'
        );

        const data = {
            numberOfUsers,
            activeUsers: activeUsers.length,
            inactiveUsers: inactiveUsers.length,
            bannedUsers: bannedUsers.length,
        };

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
