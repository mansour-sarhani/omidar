import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    function userDetails(user) {
        return {
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
    }

    try {
        if (userId) {
            //GET USER BY ID => "/api/users?userId=66b5be627f158e50829334bb"
            const user = await User.findById(userId);

            if (!user) {
                return NextResponse.json(
                    { success: false, error: 'کاربر پیدا نشد.' },
                    { status: 404 }
                );
            }

            if (user.status === 'inactive') {
                return NextResponse.json(
                    { success: false, error: 'کاربر غیرفعال است.' },
                    { status: 400 }
                );
            }

            if (user.status === 'banned') {
                return NextResponse.json(
                    { success: false, error: 'کاربر مسدود شده است.' },
                    { status: 400 }
                );
            }

            const userData = userDetails(user);

            return NextResponse.json(
                { success: true, data: userData },
                { status: 200 }
            );
        } else {
            //GET ALL USERS => "/api/admin/user"
            const users = await User.find({});

            const filteredUsers = users
                .filter((user) => !user.deleted && user.status === 'active')
                .map(userDetails);

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
