import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Contract from '@/models/Contract';
import User from '@/models/User';
import { authMiddleware } from '@/utils/authMiddleware';
import Counter from '@/models/Counter';
import { notify } from '@/utils/notify';
import { addActivity } from '@/utils/addActivity';
import Pickup from '@/models/Pickup';

//ADD PICKUP TO CONTRACT => "/api/contract/pickup?contractId=66bf44d3d02d846c4368ced0"
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
                    message: 'قرارداد با این شناسه وجود ندارد.',
                },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const dateOfArival = formData.get('dateOfArival');
        const timeOfArival = formData.get('timeOfArival');
        const numberOfPassengers = formData.get('numberOfPassengers');
        const originLocation = formData.get('originLocation');
        const pickupLocation = formData.get('pickupLocation');
        const country = formData.get('country');
        const userId = formData.get('userId');

        const pickupData = {
            dateOfArival,
            timeOfArival,
            numberOfPassengers,
            originLocation,
            pickupLocation,
            client: contract.client,
            country,
            status: 'ongoing',
            contractId,
        };

        const pickupCounter = await Counter.findByIdAndUpdate(
            { _id: 'pickupId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        pickupData.Id = pickupCounter.seq;

        const newPickup = new Pickup(pickupData);
        await newPickup.save();

        contract.pickups.push(newPickup._id);
        contract.markModified('pickups');

        await contract.save();

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;
        const message = `پیکاپ جدید توسط ${userName} به قرارداد شماره ${contract.contractNo} اضافه شد.`;

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
            performedBy: userId,
            performedByModel: 'User',
            details: message,
            contractId: contractId,
        });

        return NextResponse.json({
            success: true,
            data: newPickup,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

//UPDATE OR REMOVE pickup FROM CONTRACT => "/api/contract/pickup?contractId=66bf44d3d02d846c4368ced0&action=update"
export async function PUT(req) {
    await dbConnect();

    const authError = await authMiddleware(req);
    if (authError) {
        return authError;
    }

    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const contractId = searchParams.get('contractId');

        const contract = await Contract.findById(contractId);

        if (!contract) {
            return NextResponse.json(
                { success: false, message: 'قرارداد پیدا نشد.' },
                { status: 404 }
            );
        }

        const formData = await req.formData();
        const pickupId = formData.get('pickupId');
        const userId = formData.get('userId');

        const user = await User.findById(userId);
        const userName = user.firstName + ' ' + user.lastName;

        const pickup = await Pickup.findById(pickupId);

        if (!pickup) {
            return NextResponse.json(
                { success: false, message: 'پیکاپ وجود ندارد.' },
                { status: 400 }
            );
        }

        if (action === 'remove') {
            pickup.deleted = true;
            pickup.status = 'deleted';
            pickup.markModified('deleted');
            pickup.markModified('status');

            await pickup.save();

            contract.pickups = contract.pickups.filter(
                (pickup) => pickup._id.toString() !== pickupId
            );

            contract.markModified('pickups');

            await contract.save();

            const message = `پیکاپ توسط ${userName} از قرارداد شماره ${contract.contractNo} حذف شد.`;

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
                performedBy: userId,
                performedByModel: 'User',
                details: message,
                contractId: contractId,
            });

            return NextResponse.json({
                success: true,
                data: pickup,
            });
        } else if (action === 'update') {
            const dateOfArival = formData.get('dateOfArival');
            const timeOfArival = formData.get('timeOfArival');
            const numberOfPassengers = formData.get('numberOfPassengers');
            const originLocation = formData.get('originLocation');
            const pickupLocation = formData.get('pickupLocation');
            const country = formData.get('country');
            const status = formData.get('status');

            if (dateOfArival !== null) {
                pickup.dateOfArival = dateOfArival;
                pickup.markModified('dateOfArival');
            }

            if (timeOfArival !== null) {
                pickup.timeOfArival = timeOfArival;
                pickup.markModified('timeOfArival');
            }

            if (numberOfPassengers !== null) {
                pickup.numberOfPassengers = numberOfPassengers;
                pickup.markModified('numberOfPassengers');
            }

            if (originLocation !== null) {
                pickup.originLocation = originLocation;
                pickup.markModified('originLocation');
            }

            if (pickupLocation !== null) {
                pickup.pickupLocation = pickupLocation;
                pickup.markModified('pickupLocation');
            }

            if (country !== null) {
                pickup.country = country;
                pickup.markModified('country');
            }

            if (status !== null) {
                pickup.status = status;
                pickup.markModified('status');
            }

            await pickup.save();

            const message = `پیکاپ توسط ${userName} در قرارداد شماره ${contract.contractNo} به روزرسانی شد.`;

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
                performedBy: userId,
                performedByModel: 'User',
                details: message,
                contractId: contractId,
            });

            return NextResponse.json({ success: true, data: pickup });
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
