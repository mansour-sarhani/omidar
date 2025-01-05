import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Contract from '@/models/Contract';
import User from '@/models/User';
import Activity from '@/models/Activity';

//ADD USER TO CONTRACT => "/api/contract/user?contractId=66bf44d3d02d846c4368ced0"
export async function POST(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');

        const contract = await Contract.findOne({ _id: contractId });

        if (!contract) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'قرارداد با این شناسه وجود ندارد.',
                },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const userId = formData.get('userId');
        const performedBy = formData.get('performedBy');

        contract.users.push(userId);
        contract.markModified('users');

        contract.lastUpdatedBy = performedBy;
        contract.markModified('lastUpdatedBy');

        contract.lastUpdatedByModel = 'User';
        contract.markModified('lastUpdatedByModel');

        await contract.save();

        const updater = await User.findById(performedBy);
        const user = await User.findById(userId);

        const updaterName = updater.firstName + ' ' + updater.lastName;
        const userName = user.firstName + ' ' + user.lastName;

        const activityRecord = {
            action: 'update',
            performedBy: performedBy,
            performedByModel: 'User',
            details: `کاربر جدید ${userName} توسط ${updaterName} به قرارداد اضافه شد.`,
            contractId: contract._id,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        contract.activities.push(newActivity._id);
        contract.markModified('activities');
        contract.save();

        return NextResponse.json({
            success: true,
            contract: contract,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//REMOVE USER FROM CONTRACT => "/api/contract/user?contractId=66bf44d3d02d846c4368ced0"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const contractId = searchParams.get('contractId');

        const contract = await Contract.findOne({ _id: contractId });

        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const userId = formData.get('userId');
        const performedBy = formData.get('performedBy');

        contract.users = contract.users.filter(
            (user) => user._id.toString() !== userId
        );
        contract.markModified('users');

        contract.lastUpdatedBy = performedBy;
        contract.markModified('lastUpdatedBy');

        contract.lastUpdatedByModel = 'User';
        contract.markModified('lastUpdatedByModel');

        await contract.save();

        const updater = await User.findOne({ _id: performedBy });
        const user = await User.findOne({ _id: userId });

        const updaterName = updater.firstName + ' ' + updater.lastName;
        const userName = user.firstName + ' ' + user.lastName;

        const activityRecord = {
            action: 'delete',
            performedBy: performedBy,
            performedByModel: 'User',
            details: `کاربر با نام ${userName} توسط ${updaterName} از لیست کاربران قرارداد حذف شد.`,
            contractId: contract._id,
            timestamp: new Date(),
        };

        const newActivity = new Activity(activityRecord);
        await newActivity.save();

        contract.activities.push(newActivity._id);
        contract.markModified('activities');
        contract.save();

        return NextResponse.json({ success: true, contract });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
