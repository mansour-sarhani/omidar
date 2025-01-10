import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import { authMiddleware } from '@/utils/authMiddleware';
import Contract from '@/models/Contract';
import User from '@/models/User';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';

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

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'قرارداد پیدا نشد.',
                },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const userId = formData.get('userId');
        const performedBy = formData.get('performedBy');

        contract.users.push(userId);
        contract.markModified('users');

        await contract.save();

        const updater = await User.findById(performedBy);
        const user = await User.findById(userId);

        const updaterName = updater.firstName + ' ' + updater.lastName;
        const userName = user.firstName + ' ' + user.lastName;
        const message = `کاربر جدید ${userName} توسط ${updaterName} به قرارداد شماره ${contract.contractNo} اضافه شد.`;

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: contract.users,
            receiverModel: 'User',
        });

        await notify({
            subject: 'اطلاعیه',
            message: message,
            type: 'info',
            senderModel: 'system',
            receiver: [contract.client],
            receiverModel: 'Client',
        });

        await addActivity({
            action: 'update',
            performedBy: performedBy,
            performedByModel: 'User',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({
            success: true,
            data: contract,
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

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const userId = formData.get('userId');
        const performedBy = formData.get('performedBy');

        const updater = await User.findById(performedBy);
        const user = await User.findById(userId);

        contract.users = contract.users.filter(
            (user) => user._id.toString() !== userId
        );
        contract.markModified('users');

        await contract.save();

        const updaterName = updater.firstName + ' ' + updater.lastName;
        const userName = user.firstName + ' ' + user.lastName;
        const message = `کاربر با نام ${userName} توسط ${updaterName} از لیست کاربران قرارداد شماره ${contract.contractNo} حذف شد.`;

        await addActivity({
            action: 'delete',
            performedBy: performedBy,
            performedByModel: 'User',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({ success: true, data: contract });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
